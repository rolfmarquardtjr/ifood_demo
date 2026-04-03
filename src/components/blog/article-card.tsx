import Link from "next/link";
import Image from "next/image";

const categoryConfig: Record<string, { label: string; badgeClass: string }> = {
  seguranca: { label: "Segurança no Trânsito", badgeClass: "bg-red-500 text-white" },
  prevencao: { label: "Prevenção de Acidentes", badgeClass: "bg-yellow-500 text-white" },
  conscientizacao: { label: "Conscientização", badgeClass: "bg-amber-500 text-white" },
};

interface ArticleCardProps {
  slug: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string | null;
  createdAt: string;
  audioUrl?: string | null;
}

function estimateReadTime(summary: string): number {
  const words = summary.split(/\s+/).length;
  return Math.max(3, Math.ceil((words * 8) / 200));
}

function estimateViews(createdAt: string): string {
  const days = Math.max(1, Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000));
  const views = Math.floor(800 + days * 120 + Math.random() * 500);
  return views.toLocaleString("pt-BR");
}

export function ArticleCard({ slug, title, summary, category, imageUrl, createdAt, audioUrl }: ArticleCardProps) {
  const date = new Date(createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const readTime = estimateReadTime(summary);
  const views = estimateViews(createdAt);
  const cat = categoryConfig[category] || { label: category, badgeClass: "bg-gray-500 text-white" };

  return (
    <Link href={`/artigo/${slug}`} className="group block">
      <article className="bg-card rounded-2xl overflow-hidden border border-border hover:border-border/80 transition-all duration-300">
        {/* Image */}
        <div className="aspect-[16/9] relative overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <span className="text-3xl font-black text-foreground/10">iF</span>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${cat.badgeClass}`}>
              {cat.label}
            </span>
          </div>
          {/* Audio indicator */}
          {audioUrl && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#EA1D2C]/90 shadow-lg shadow-[#EA1D2C]/30 animate-pulse">
              <svg className="w-3 h-3 text-[#13151A]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span className="text-[10px] font-bold text-[#13151A] uppercase tracking-wider">Ouvir</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-heading text-lg font-bold leading-snug text-foreground group-hover:text-[#EA1D2C] transition-colors duration-300 line-clamp-2 mb-2">
            {title}
          </h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-2 mb-4">{summary}</p>

          {/* Footer with metadata */}
          <div className="pt-3 border-t border-border flex items-center gap-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              {date}
            </span>
            {audioUrl ? (
              <span className="inline-flex items-center gap-1.5 text-[#EA1D2C]">
                <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Ouvir artigo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {readTime} min de leitura
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 ml-auto">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {views}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
