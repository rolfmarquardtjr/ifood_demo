import { getDb, hasDb } from "@/lib/db";
import { articles, podcasts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { HeroArticle } from "@/components/blog/hero-article";
import { ArticleCard } from "@/components/blog/article-card";
import { PodcastPlayer } from "@/components/blog/podcast-player";
import { NewsletterForm } from "@/components/blog/newsletter-form";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface ArticleRow {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string | null;
  audioUrl: string | null;
  createdAt: Date;
  status: string;
  content: string;
  sources: unknown;
  imageSource: string | null;
  aiModel: string | null;
  updatedAt: Date;
}

export default async function HomePage() {
  let publishedArticles: ArticleRow[] = [];
  let latestPodcast: {
    id: number;
    title: string;
    description: string;
    audioUrl: string;
    createdAt: Date;
  }[] = [];

  if (hasDb()) {
    const db = getDb();
    publishedArticles = await db
      .select()
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.createdAt))
      .limit(10);
    latestPodcast = await db
      .select()
      .from(podcasts)
      .where(eq(podcasts.status, "published"))
      .orderBy(desc(podcasts.createdAt))
      .limit(1);
  }

  const [hero, ...rest] = publishedArticles;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {hero ? (
        <HeroArticle
          slug={hero.slug}
          title={hero.title}
          summary={hero.summary}
          category={hero.category}
          imageUrl={hero.imageUrl}
          createdAt={hero.createdAt.toISOString()}
          audioUrl={hero.audioUrl}
        />
      ) : (
        <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center bg-background overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 dark:opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />

          <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-heading text-foreground tracking-tight mb-6">
              iFood <span className="text-[#EA1D2C]">Na Pista</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Segurança pra quem vive no corre. Maio Amarelo é todo dia, parceiro.
            </p>
          </div>
        </section>
      )}

      {/* Podcast do Dia -- between hero and articles */}
      {latestPodcast[0] && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA1D2C] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EA1D2C]" />
            </span>
            <span className="text-sm font-bold text-[#EA1D2C] uppercase tracking-wider">Episódio do dia</span>
          </div>
          <PodcastPlayer
            title={latestPodcast[0].title}
            description={latestPodcast[0].description}
            audioUrl={latestPodcast[0].audioUrl}
          />
        </section>
      )}

      {/* DESTAQUES / Últimas Notícias */}
      {rest.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Section header */}
          <div className="mb-10">
            {/* DESTAQUES label with trending icon */}
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-5 h-5 text-[#EA1D2C]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                />
              </svg>
              <span className="text-sm font-bold text-[#EA1D2C] uppercase tracking-wider">
                Destaques
              </span>
            </div>

            {/* Title row with "Ver todas" link */}
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-heading tracking-tight text-foreground mb-2">
                  Últimas Notícias
                </h2>
                <div className="w-16 h-1 bg-[#EA1D2C] rounded-full mt-2" />
              </div>
              <Link
                href="/categoria/delivery"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors group"
              >
                Ver todas
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* 3-column article card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article) => (
              <ArticleCard
                key={article.id}
                slug={article.slug}
                title={article.title}
                summary={article.summary}
                category={article.category}
                imageUrl={article.imageUrl}
                createdAt={article.createdAt.toISOString()}
                audioUrl={article.audioUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* Stats section when no content */}
      {publishedArticles.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Logística & Entrega",
                desc: "Dicas pra quem tá no corre: como se virar nas corridas, cuidar da moto e chegar bem em casa",
                color: "from-red-500/20 to-red-600/10",
                iconPath:
                  "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25H21a1.125 1.125 0 001.125-1.125v-3.75a1.125 1.125 0 00-1.125-1.125H3.375A1.125 1.125 0 002.25 9.375v3.75c0 .621.504 1.125 1.125 1.125z",
              },
              {
                title: "Restaurantes & Parceiros",
                desc: "Os parceiros que fazem a parada acontecer. Histórias de quem tá junto nessa",
                color: "from-orange-500/20 to-orange-600/10",
                iconPath:
                  "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.349m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.999 2.999 0 00.621-1.853L4.5 5.25A2.25 2.25 0 016.75 3h10.5a2.25 2.25 0 012.25 2.25v2.246a2.999 2.999 0 00.621 1.853",
              },
              {
                title: "Tendências & Inovação",
                desc: "O que tá mudando no mundo do delivery, apps novos e tecnologia pra facilitar o trampo",
                color: "from-emerald-500/20 to-emerald-600/10",
                iconPath:
                  "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="relative group p-8 rounded-2xl bg-foreground/5 dark:bg-white/[0.03] border border-border hover:border-[#EA1D2C]/50 transition-all duration-500"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5`}
                >
                  <svg
                    className="w-6 h-6 text-foreground/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={item.iconPath}
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#EA1D2C]/[0.05] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter banner */}
      <NewsletterForm variant="banner" />
    </div>
  );
}
