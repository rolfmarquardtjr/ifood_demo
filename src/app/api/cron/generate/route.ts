import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { articles, sources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getApiKeys, getSetting, getArticleAudioConfig } from "@/lib/ai/settings";
import { generateArticleContent, generateAudioGuideScript } from "@/lib/ai/content";
import { generateImage } from "@/lib/ai/image";
import { generateTTSAudio } from "@/lib/ai/tts";
import { uploadImage, uploadAudio } from "@/lib/blob";

export const maxDuration = 300;

// Search real news using configured sources + Gemini with Google Search grounding
async function searchRealNews(
  category: string,
  configuredSources: { name: string; url: string }[],
  apiKey: string,
): Promise<{ title: string; summary: string; source: string }[]> {
  const categoryTopics: Record<string, string> = {
    delivery: "logística de entrega, last mile delivery, entregadores, aplicativos de delivery, iFood, operação de entrega Brasil",
    restaurantes: "restaurantes parceiros, gastronomia, food service, dark kitchens, cloud kitchens, tendências culinárias Brasil",
    tendencias: "food tech, inovação em alimentação, inteligência artificial em delivery, tendências de consumo, mercado de delivery Brasil",
  };

  const topic = categoryTopics[category] || categoryTopics.delivery;

  // Build source context from configured sources
  const sourceContext = configuredSources.length > 0
    ? `\n\nFontes prioritarias para buscar (use estas como referencia principal, mas pode complementar com outras fontes oficiais):\n${configuredSources.map(s => `- ${s.name}: ${s.url}`).join("\n")}`
    : "";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Busque as notícias mais recentes (últimos 7 dias) sobre: ${topic}.${sourceContext}

CONTEXTO: Este conteúdo é para o blog iFood Na Pista, focado em segurança no trânsito para motoboys, dicas de entrega e novidades do mundo do entregador. Maio Amarelo 2026: no trânsito, enxergar o outro salva vidas.

REGRAS:
- Use APENAS informações reais encontradas na busca, NUNCA invente notícias
- Priorize notícias das fontes configuradas acima
- Pode complementar com fontes oficiais BRASILEIRAS: Abrasel, ANR, portais de gastronomia, food tech e delivery
- SOMENTE fontes do Brasil, em português brasileiro
- Priorize notícias RELEVANTES para o ecossistema delivery: tendências, tecnologia, restaurantes, entregadores, consumo
- Cada notícia deve ter título real e resumo focado no impacto para o mercado de delivery

Retorne APENAS um JSON array com as 3 notícias mais relevantes no formato:
[{"title": "título real da notícia", "summary": "resumo factual em 2-3 frases focando no impacto pro motorista", "source": "nome do site/portal"}]`
          }]
        }],
        tools: [{ googleSearch: {} }],
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini Search error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Falha ao parsear notícias da busca");

  return JSON.parse(jsonMatch[0]);
}

export async function POST(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  try {
    // Check if today is a generation day
    const today = new Date().getDay(); // 0=Dom, 1=Seg, ..., 6=Sab
    const articleDays = await getSetting<boolean[]>("article_days") || [false, true, true, true, true, true, false];
    if (!articleDays[today]) {
      return NextResponse.json({ message: "Hoje nao e dia de gerar artigos", skipped: true });
    }

    const keys = await getApiKeys();
    if (!keys.google) {
      return NextResponse.json({ error: "Chave Google AI nao configurada" }, { status: 400 });
    }

    const db = getDb();
    const articlesPerDay = 1;
    const proportions = await getSetting<{ delivery: number; restaurantes: number; tendencias: number }>("category_proportions") || { delivery: 40, restaurantes: 35, tendencias: 25 };

    // Load configured sources from DB
    const activeSources = await db.select().from(sources).where(eq(sources.active, true));

    // Determine categories for today based on proportions
    const categories: string[] = [];
    const total = proportions.delivery + proportions.restaurantes + proportions.tendencias;
    for (let i = 0; i < articlesPerDay; i++) {
      const rand = Math.random() * total;
      if (rand < proportions.delivery) categories.push("delivery");
      else if (rand < proportions.delivery + proportions.restaurantes) categories.push("restaurantes");
      else categories.push("tendencias");
    }

    const generated = [];

    for (const category of categories) {
      try {
        // Filter sources for this category (+ "geral" sources)
        const categorySources = activeSources
          .filter(s => s.category === category || s.category === "geral")
          .map(s => ({ name: s.name, url: s.url }));

        // 1. Search real news with Gemini + Google Search + configured sources
        const news = await searchRealNews(category, categorySources, keys.google);
        if (news.length === 0) continue;

        const picked = news[0];

        // 2. Generate article content
        const content = await generateArticleContent(picked.title, picked.summary, category);

        // 3. Generate cover image
        let imageUrl: string | null = null;
        try {
          const imgResult = await generateImage(content.imagePrompt);
          const slugImg = picked.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").substring(0, 50);
          imageUrl = await uploadImage(imgResult.imageBuffer, `article-${slugImg}-${Date.now()}.${imgResult.format}`);
        } catch (imgErr) {
          console.error("Erro ao gerar imagem:", imgErr);
        }

        // 4. Generate audio guide
        let audioUrl: string | null = null;
        try {
          const audioScript = await generateAudioGuideScript(picked.title, content.summary, content.content);
          const audioConfig = await getArticleAudioConfig();
          const ttsResult = await generateTTSAudio([{ speaker: audioConfig.voice, text: audioScript }]);
          const slugAudio = picked.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").substring(0, 50);
          audioUrl = await uploadAudio(ttsResult.audioBuffer, `audio-${slugAudio}-${Date.now()}.${ttsResult.format}`);
        } catch (audioErr) {
          console.error("Erro ao gerar audio:", audioErr);
        }

        // 5. Create slug and save
        const date = new Date().toISOString().split("T")[0];
        const slug = picked.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .substring(0, 80)
          + `-${date}`;

        // Build sources array from search result
        const articleSources = picked.source
          ? [{ url: "", title: picked.title, site: picked.source }]
          : [];

        const [article] = await db
          .insert(articles)
          .values({
            title: picked.title,
            slug,
            summary: content.summary,
            content: content.content,
            category,
            imageUrl,
            imageSource: imageUrl ? "ai" : null,
            audioUrl,
            sources: articleSources,
            status: "published",
            aiModel: "gemini-2.5-flash+search",
          })
          .returning();

        generated.push({ id: article.id, title: article.title, category, source: picked.source });
      } catch (err) {
        console.error(`Erro ao gerar artigo ${category}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      articlesGenerated: generated.length,
      articles: generated,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
