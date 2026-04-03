import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { articles, podcasts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { generatePodcastScript } from "@/lib/ai/content";
import { generateTTSAudio } from "@/lib/ai/tts";
import { uploadAudio } from "@/lib/blob";

export const maxDuration = 300;

export async function POST(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { articleIds } = body as { articleIds?: number[] };

    const db = getDb();

    // Get articles to discuss
    let selectedArticles;
    if (articleIds && articleIds.length > 0) {
      const allArticles = await db.select().from(articles).where(eq(articles.status, "published")).orderBy(desc(articles.createdAt));
      selectedArticles = allArticles.filter((a) => articleIds.includes(a.id));
    } else {
      // Default: latest 3 published articles
      selectedArticles = await db
        .select()
        .from(articles)
        .where(eq(articles.status, "published"))
        .orderBy(desc(articles.createdAt))
        .limit(3);
    }

    if (selectedArticles.length === 0) {
      return NextResponse.json({ error: "Nenhum artigo encontrado para o podcast" }, { status: 400 });
    }

    // 1. Generate script
    const summaries = selectedArticles.map((a) => ({ title: a.title, summary: a.summary }));
    const script = await generatePodcastScript(summaries);

    // 2. Generate TTS audio
    const ttsResult = await generateTTSAudio(script);

    // 3. Upload to Blob
    const today = new Date().toISOString().split("T")[0];
    const filename = `podcast-${today}.${ttsResult.format}`;
    const audioUrl = await uploadAudio(ttsResult.audioBuffer, filename);

    // 4. Estimate duration (rough: ~150 words per minute in pt-BR)
    const totalWords = script.reduce((acc, s) => acc + s.text.split(" ").length, 0);
    const durationSeconds = Math.round((totalWords / 150) * 60);

    // 5. Save podcast
    const [podcast] = await db
      .insert(podcasts)
      .values({
        title: `Podcast Na Pista — ${new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}`,
        description: `Notícias do dia: ${selectedArticles.map((a) => a.title).join(", ")}`,
        audioUrl,
        durationSeconds,
        script,
        articleIds: selectedArticles.map((a) => a.id),
        status: "published",
      })
      .returning();

    return NextResponse.json({
      success: true,
      podcast,
      scriptLines: script.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
