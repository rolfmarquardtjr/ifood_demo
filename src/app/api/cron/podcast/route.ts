import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { articles, podcasts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { getSetting } from "@/lib/ai/settings";
import { generatePodcastScript } from "@/lib/ai/content";
import { generateTTSAudio } from "@/lib/ai/tts";
import { uploadAudio } from "@/lib/blob";

export const maxDuration = 300;

export async function POST(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  try {
    // Check if today is a podcast day
    const today = new Date().getDay();
    const podcastDays = await getSetting<boolean[]>("podcast_days") || [false, true, false, false, true, false, false];
    if (!podcastDays[today]) {
      return NextResponse.json({ message: "Hoje nao e dia de podcast", skipped: true });
    }

    const db = getDb();

    // Get today's published articles (latest 3)
    const todayArticles = await db
      .select()
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.createdAt))
      .limit(3);

    if (todayArticles.length === 0) {
      return NextResponse.json({ error: "Nenhum artigo publicado para o podcast" }, { status: 400 });
    }

    // Generate script
    const script = await generatePodcastScript(
      todayArticles.map((a) => ({ title: a.title, summary: a.summary })),
    );

    // Generate TTS audio (chunked for long scripts)
    const ttsResult = await generateTTSAudio(script);

    // Upload
    const audioUrl = await uploadAudio(
      ttsResult.audioBuffer,
      `podcast-ifood-insights-${Date.now()}.${ttsResult.format}`,
    );

    // Estimate duration
    const totalWords = script.reduce((acc, s) => acc + s.text.split(" ").length, 0);
    const durationSeconds = Math.round((totalWords / 150) * 60);

    // Save
    const [podcast] = await db
      .insert(podcasts)
      .values({
        title: `Podcast iFood Insights — ${new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}`,
        description: `Notícias do dia: ${todayArticles.map((a) => a.title).join(", ")}`,
        audioUrl,
        durationSeconds,
        script,
        articleIds: todayArticles.map((a) => a.id),
        status: "published",
      })
      .returning();

    return NextResponse.json({
      success: true,
      podcast: { id: podcast.id, title: podcast.title, durationSeconds },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
