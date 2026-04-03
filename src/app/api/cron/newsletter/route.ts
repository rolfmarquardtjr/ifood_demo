import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/auth";

export async function POST(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // TODO: Implement newsletter pipeline
  // 1. Get today's articles with audio_url
  // 2. Get active subscribers
  // 3. Send email via Resend batch API

  return NextResponse.json({ message: "Newsletter executada" });
}
