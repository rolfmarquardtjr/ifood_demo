import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const db = getDb();
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const status = url.searchParams.get("status");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const offset = parseInt(url.searchParams.get("offset") || "0");

  let query = db.select().from(articles).orderBy(desc(articles.createdAt)).limit(limit).offset(offset);

  const allArticles = await query;

  // Filter in JS for simplicity (small dataset)
  let filtered = allArticles;
  if (category) filtered = filtered.filter(a => a.category === category);
  if (status) filtered = filtered.filter(a => a.status === status);

  return NextResponse.json(filtered);
}

export async function PUT(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    const db = getDb();
    await db.update(articles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(articles.id, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }

  const db = getDb();
  await db.delete(articles).where(eq(articles.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
