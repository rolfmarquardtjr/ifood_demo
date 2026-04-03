import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { sources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const db = getDb();
  const allSources = await db.select().from(sources);
  return NextResponse.json(allSources);
}

export async function POST(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const db = getDb();
    const result = await db.insert(sources).values({
      name: body.name,
      url: body.url,
      category: body.category,
      selector: body.selector || null,
    }).returning();
    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json({ error: "Erro ao criar fonte" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    const db = getDb();
    await db.update(sources).set(updates).where(eq(sources.id, id));
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
  if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  const db = getDb();
  await db.delete(sources).where(eq(sources.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
