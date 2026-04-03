import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const db = getDb();
  const allSubscribers = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
  return NextResponse.json(allSubscribers);
}
