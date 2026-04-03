import Image from "next/image";
import { getDb, hasDb } from "@/lib/db";
import { podcasts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { PodcastPlayer } from "@/components/blog/podcast-player";

export const dynamic = "force-dynamic";

export default async function PodcastPage() {
  let allPodcasts: { id: number; title: string; description: string; audioUrl: string; createdAt: Date; durationSeconds: number | null; status: string; script: unknown; articleIds: unknown }[] = [];
  if (hasDb()) {
    allPodcasts = await getDb()
      .select()
      .from(podcasts)
      .where(eq(podcasts.status, "published"))
      .orderBy(desc(podcasts.createdAt))
      .limit(50);
  }

  const [latest, ...older] = allPodcasts;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Gradient Hero */}
      <div className="relative w-full h-[350px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EA1D2C] via-[#b8151f] to-[#8a1018]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Content over gradient */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-6 px-5 py-2.5 rounded-full bg-card/60 backdrop-blur-xl border border-border shadow-2xl">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA1D2C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EA1D2C]"></span>
              </span>
              <span className="text-xs font-bold text-foreground tracking-widest uppercase">
                Na Pista no Ar
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
              <span className="text-white">Podcast</span>
              <span className="text-white/80"> Na Pista</span>
            </h1>
            <Image
              src="/logo-ifood-header.png"
              alt="iFood"
              width={180}
              height={50}
              className="mx-auto mb-6 h-12 sm:h-14 md:h-16 w-auto object-contain brightness-0 invert opacity-90"
              priority
            />
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tião e Juh batem um papo sobre o dia a dia do entregador, segurança no trânsito e o corre do delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Podcast content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {latest ? (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Episódio mais recente</h2>
            <PodcastPlayer title={latest.title} description={latest.description} audioUrl={latest.audioUrl} />
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-border p-12 text-center mb-8">
            <p className="text-muted-foreground">Nenhum episódio publicado ainda.</p>
          </div>
        )}

        {older.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Episódios anteriores</h2>
            <div className="space-y-3">
              {older.map((podcast) => (
                <PodcastPlayer key={podcast.id} title={podcast.title} description={podcast.description} audioUrl={podcast.audioUrl} compact />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
