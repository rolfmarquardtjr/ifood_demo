import Link from "next/link";
import Image from "next/image";

const categoryConfig: Record<string, { label: string; badgeClass: string }> = {
  seguranca: { label: "Segurança no Trânsito", badgeClass: "bg-red-500 text-white" },
  prevencao: { label: "Prevenção de Acidentes", badgeClass: "bg-yellow-500 text-white" },
  conscientizacao: { label: "Conscientização", badgeClass: "bg-amber-500 text-white" },
};

interface HeroArticleProps {
  slug: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string | null;
  createdAt: string;
  audioUrl?: string | null;
}

export function HeroArticle({ slug, title, summary, category, imageUrl, createdAt, audioUrl }: HeroArticleProps) {
  const date = new Date(createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const cat = categoryConfig[category] || { label: category, badgeClass: "bg-gray-500 text-white" };

  return (
    <Link href={`/artigo/${slug}`} className="group block">
      <div className="relative w-full h-[420px] md:h-[560px] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-1000"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-background" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-6 left-6 md:top-8 md:right-8 md:left-auto">
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${cat.badgeClass}`}>
            {cat.label}
          </span>
        </div>

        {/* Content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10">
          <div className="max-w-4xl text-left">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading text-foreground leading-tight mb-2 sm:mb-4 group-hover:text-[#EA1D2C] transition-colors duration-500">
              {title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-3 sm:mb-6 max-w-2xl line-clamp-2">
              {summary}
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#EA1D2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                {date}
              </span>
              {audioUrl && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EA1D2C]/15 text-[#EA1D2C] text-xs font-semibold animate-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA1D2C] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EA1D2C]" />
                  </span>
                  Ouvir artigo
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
