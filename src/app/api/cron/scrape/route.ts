import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/auth";

export async function POST(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // TODO: Implement scraping pipeline
  // 1. Read active sources from DB
  // 2. Scrape each source with Cheerio
  // 3. Save to pending_articles
  // 4. AI selects best 2 candidates

  return NextResponse.json({ message: "Scrape executado", articlesFound: 0 });
}
