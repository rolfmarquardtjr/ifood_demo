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
      {/* Video Hero — compact on mobile, full on desktop */}
      <div className="relative w-full h-[350px] md:h-[600px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/transito-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Content — bottom-aligned on mobile, centered on desktop */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:absolute md:inset-0 md:flex md:items-center md:justify-center">
          <div className="max-w-5xl mx-auto text-center">
            {/* iFood logo — hidden on mobile (already in header), visible on desktop */}
            <Image
              src="/logo-ifood-header.png"
              alt="iFood"
              width={300}
              height={80}
              className="hidden md:block mx-auto mb-8 h-24 w-auto object-contain brightness-0 invert"
              priority
            />

            {/* Live badge */}
            <div className="inline-flex items-center gap-2 mb-4 sm:mb-8 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-[#EA1D2C]/90 backdrop-blur-sm shadow-2xl shadow-[#EA1D2C]/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-white tracking-widest uppercase">
                Na Pista no Ar
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-6xl md:text-8xl font-heading font-bold tracking-tight mb-3 sm:mb-6 leading-[0.95]">
              <span className="text-white">Podcast </span>
              <span className="text-[#EA1D2C] drop-shadow-[0_2px_10px_rgba(234,29,44,0.5)]">Na Pista</span>
            </h1>

            <p className="text-xs sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Faísca e Braba batem um papo sobre o dia a dia do entregador, segurança no trânsito e o corre do delivery.
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
