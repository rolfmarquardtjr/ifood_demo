import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const db = getDb();
  const allSettings = await db.select().from(settings);
  const result: Record<string, unknown> = {};
  for (const s of allSettings) {
    result[s.key] = s.value;
  }
  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const db = getDb();
    for (const [key, value] of Object.entries(body)) {
      await db.insert(settings)
        .values({ key, value: value as Record<string, unknown>, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: settings.key,
          set: { value: value as Record<string, unknown>, updatedAt: new Date() },
        });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}
