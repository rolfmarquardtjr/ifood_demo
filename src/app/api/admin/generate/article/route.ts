import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { generateArticleContent, generateAudioGuideScript } from "@/lib/ai/content";
import { getArticleAudioConfig } from "@/lib/ai/settings";
import { generateImage } from "@/lib/ai/image";
import { generateTTSAudio } from "@/lib/ai/tts";
import { uploadImage, uploadAudio } from "@/lib/blob";

export const maxDuration = 300;

export async function POST(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  try {
    const { title, originalSummary, category, generateImg, generateAudio } = await request.json();

    if (!title || !category) {
      return NextResponse.json({ error: "Titulo e categoria obrigatorios" }, { status: 400 });
    }

    // 1. Generate article content
    const generated = await generateArticleContent(title, originalSummary || title, category);

    // 2. Generate cover image
    let imageUrl: string | null = null;
    if (generateImg !== false) {
      const imgResult = await generateImage(generated.imagePrompt);
      const slugImg = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      imageUrl = await uploadImage(imgResult.imageBuffer, `article-${slugImg}.${imgResult.format}`);
    }

    // 3. Generate immersive audio guide via TTS
    let audioUrl: string | null = null;
    if (generateAudio !== false) {
      const audioConfig = await getArticleAudioConfig();
      const audioScript = await generateAudioGuideScript(title, generated.summary, generated.content);
      const ttsResult = await generateTTSAudio([
        { speaker: audioConfig.voice, text: audioScript },
      ]);
      const slugAudio = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      audioUrl = await uploadAudio(ttsResult.audioBuffer, `article-audio-${slugAudio}.${ttsResult.format}`);
    }

    // 4. Create slug
    const date = new Date().toISOString().split("T")[0];
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + `-${date}`;

    // 5. Save article
    const db = getDb();
    const [article] = await db
      .insert(articles)
      .values({
        title,
        slug,
        summary: generated.summary,
        content: generated.content,
        category,
        imageUrl,
        imageSource: imageUrl ? "ai" : null,
        audioUrl,
        sources: [],
        status: "draft",
        aiModel: "ai-generated",
      })
      .returning();

    return NextResponse.json({ success: true, article });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
