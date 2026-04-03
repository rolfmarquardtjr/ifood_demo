import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
    }

    const db = getDb();
    await db.update(subscribers)
      .set({ active: false, unsubscribedAt: new Date() })
      .where(eq(subscribers.email, email.toLowerCase()));

    return NextResponse.json({ message: "Inscrição cancelada" });
  } catch {
    return NextResponse.json({ error: "Erro ao cancelar" }, { status: 500 });
  }
}
