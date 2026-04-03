import { getDb, hasDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq, desc, and, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/blog/article-card";
import { PodcastPlayer } from "@/components/blog/podcast-player";
import { NewsletterForm } from "@/components/blog/newsletter-form";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const categoryConfig: Record<string, { label: string; badgeClass: string; href: string }> = {
  delivery: { label: "Logística & Entrega", badgeClass: "bg-red-500 text-white", href: "/categoria/delivery" },
  restaurantes: { label: "Restaurantes & Parceiros", badgeClass: "bg-orange-500 text-white", href: "/categoria/restaurantes" },
  tendencias: { label: "Tendências & Inovação", badgeClass: "bg-emerald-500 text-white", href: "/categoria/tendencias" },
};

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 200));
}

function estimateViews(createdAt: Date): string {
  const days = Math.max(1, Math.floor((Date.now() - createdAt.getTime()) / 86400000));
  return Math.floor(800 + days * 120 + 300).toLocaleString("pt-BR");
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!hasDb()) notFound();
  const db = getDb();

  const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  const article = result[0];

  if (!article || article.status !== "published") {
    notFound();
  }

  const related = await db
    .select()
    .from(articles)
    .where(and(eq(articles.category, article.category), eq(articles.status, "published"), ne(articles.id, article.id)))
    .orderBy(desc(articles.createdAt))
    .limit(3);

  const date = article.createdAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const readTime = estimateReadTime(article.content);
  const views = estimateViews(article.createdAt);
  const sources = article.sources as Array<{ url: string; title: string; site: string }>;
  const cat = categoryConfig[article.category] || { label: article.category, badgeClass: "bg-gray-500 text-white", href: "#" };

  return (
    <div>
      {/* Cover image */}
      <div className="relative w-full h-[350px] md:h-[500px] overflow-hidden">
        {article.imageUrl ? (
          <Image src={article.imageUrl} alt={article.title} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Category badge on image */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-8">
          <Link href={cat.href} className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${cat.badgeClass}`}>
            {cat.label}
          </Link>
        </div>
      </div>

      {/* Article content - rises over image */}
      <article className="relative" style={{ marginTop: "-120px" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="py-3 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-sm flex-wrap">
              <li>
                <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 21v-8a1 1 0 00-1-1h-4a1 1 0 00-1 1v8m-4 0h14a2 2 0 002-2V10a2 2 0 00-.709-1.528l-7-5.999a2 2 0 00-2.582 0l-7 5.999A2 2 0 003 10v9a2 2 0 002 2z" /></svg>
                  <span className="sr-only sm:not-sr-only">Início</span>
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
                <Link href={cat.href} className="text-muted-foreground hover:text-foreground transition-colors">{cat.label}</Link>
              </li>
              <li className="flex items-center gap-1">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
                <span className="text-foreground font-medium line-clamp-1">{article.title}</span>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight text-foreground">
              {article.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed font-light">
              {article.summary}
            </p>

            {/* Metadata bar */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground py-5 border-t border-b border-border">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#EA1D2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                {date}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#EA1D2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {readTime} min de leitura
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#EA1D2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {views} visualizações
              </span>
            </div>
          </header>

          {/* Audio player */}
          {article.audioUrl && (
            <div className="mb-10">
              <PodcastPlayer title="Ouvir este artigo" description={article.summary} audioUrl={article.audioUrl} compact />
            </div>
          )}

          {/* Article body */}
          <div className="prose prose-lg dark:prose-invert font-sans max-w-none mb-16 prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-a:text-[#EA1D2C] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-[#EA1D2C] prose-img:rounded-xl prose-img:shadow-lg prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-muted-foreground prose-table:text-sm prose-th:text-left">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
          </div>

          {/* Sources */}
          {sources && sources.length > 0 && (
            <section className="mb-16 bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-xl font-bold mb-4 text-foreground">Fontes</h2>
              <ul className="space-y-3">
                {sources.map((source, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-4 h-4 mt-1 text-[#EA1D2C] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.07a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.798" /></svg>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-[#EA1D2C] transition-colors">
                      <span className="font-medium text-foreground">{source.site}</span> — {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>

      {/* Newsletter */}
      <NewsletterForm variant="banner" />

      {/* Related articles */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold mb-6">Artigos Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => (
              <ArticleCard
                key={r.id}
                slug={r.slug}
                title={r.title}
                summary={r.summary}
                category={r.category}
                imageUrl={r.imageUrl}
                createdAt={r.createdAt.toISOString()}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
