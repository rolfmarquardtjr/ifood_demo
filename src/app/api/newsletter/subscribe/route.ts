import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const db = getDb();

    // Check if already subscribed
    const existing = await db.select().from(subscribers).where(eq(subscribers.email, email.toLowerCase())).limit(1);

    if (existing.length > 0) {
      if (existing[0].active) {
        return NextResponse.json({ message: "Você já está inscrito!" });
      }
      // Reactivate
      await db.update(subscribers)
        .set({ active: true, unsubscribedAt: null })
        .where(eq(subscribers.email, email.toLowerCase()));
      return NextResponse.json({ message: "Inscrição reativada!" });
    }

    await db.insert(subscribers).values({
      email: email.toLowerCase(),
    });

    return NextResponse.json({ message: "Inscrito com sucesso!" });
  } catch {
    return NextResponse.json({ error: "Erro ao inscrever" }, { status: 500 });
  }
}
