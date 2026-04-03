import { getDb, hasDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { ArticleCard } from "@/components/blog/article-card";
import { notFound } from "next/navigation";

const categoryLabels: Record<string, string> = {
  seguranca: "Segurança no Trânsito",
  prevencao: "Prevenção de Acidentes",
  conscientizacao: "Conscientização",
};

const categoryDescriptions: Record<string, string> = {
  seguranca: "Dicas práticas de segurança pra quem pilota todo dia. Equipamentos, técnicas e o que fazer pra voltar pra casa inteiro.",
  prevencao: "Como evitar acidentes no trânsito. Cuidados com a moto, atenção no corredor e prevenção no dia a dia do entregador.",
  conscientizacao: "Maio Amarelo é todo dia. Campanhas, dados reais e histórias que fazem a gente pensar sobre o trânsito.",
};

export default async function CategoryPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;

  if (!categoryLabels[categoria]) {
    notFound();
  }

  let categoryArticles: { id: number; slug: string; title: string; summary: string; category: string; imageUrl: string | null; audioUrl: string | null; createdAt: Date }[] = [];
  if (hasDb()) {
    categoryArticles = await getDb()
      .select()
      .from(articles)
      .where(and(eq(articles.category, categoria), eq(articles.status, "published")))
      .orderBy(desc(articles.createdAt))
      .limit(50);
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-[72px]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section header -- same style as home page */}
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

          {/* Title with underline */}
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {categoryLabels[categoria]}
            </h1>
            <div className="w-16 h-1 bg-[#EA1D2C] rounded-full mt-3" />
          </div>
          <p className="text-muted-foreground mt-3">{categoryDescriptions[categoria]}</p>
        </div>

        {categoryArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryArticles.map((article) => (
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
        ) : (
          <div className="rounded-2xl bg-card border border-border p-12 text-center">
            <p className="text-muted-foreground">Nenhum artigo nesta categoria ainda.</p>
          </div>
        )}
      </section>
    </div>
  );
}
