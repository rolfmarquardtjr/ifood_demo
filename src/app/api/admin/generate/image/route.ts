import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateImage } from "@/lib/ai/image";
import { uploadImage } from "@/lib/blob";

export const maxDuration = 120;

export async function POST(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  try {
    const { prompt, articleId } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt obrigatorio" }, { status: 400 });
    }

    const result = await generateImage(prompt);

    const filename = `article-${articleId || Date.now()}.${result.format}`;
    const imageUrl = await uploadImage(result.imageBuffer, filename);

    // If articleId provided, update the article
    if (articleId) {
      const db = getDb();
      await db
        .update(articles)
        .set({ imageUrl, imageSource: "gemini", updatedAt: new Date() })
        .where(eq(articles.id, articleId));
    }

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
