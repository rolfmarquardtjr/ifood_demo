"use client";

import { useRef, useState } from "react";

interface PodcastPlayerProps {
  title: string;
  description: string;
  audioUrl: string;
  compact?: boolean;
}

export function PodcastPlayer({ title, description, audioUrl, compact = false }: PodcastPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  // Extract date from title like "Podcast Na Pista — 19 de março de 2026"
  const dateSplit = title.split("—").length > 1 ? title.split("—")[1].trim() : title.split("-").length > 1 ? title.split("-").slice(1).join("-").trim() : null;
  const podcastDate = dateSplit;

  if (compact) {
    return (
      <div className="group relative bg-card rounded-2xl border border-border p-4 hover:border-[#EA1D2C]/20 transition-all duration-300">
        <audio ref={audioRef} preload="metadata" onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)} onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} onEnded={() => setIsPlaying(false)} onError={() => setError(true)}>
          <source src={audioUrl} type={audioUrl.endsWith(".wav") ? "audio/wav" : audioUrl.endsWith(".mp3") ? "audio/mpeg" : "audio/wav"} />
        </audio>
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={togglePlay} className="w-10 h-10 rounded-xl bg-[#EA1D2C] hover:bg-[#C41825] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#EA1D2C]/20 transition-all duration-300 cursor-pointer">
            {isPlaying ? (
              <svg className="w-4 h-4 text-[#13151A]" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
            ) : (
              <svg className="w-4 h-4 text-[#13151A] ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading text-sm sm:text-base font-bold text-foreground">{podcastDate ? "Podcast Na Pista" : title}</h3>
              {podcastDate && (
                <span className="text-[10px] text-muted-foreground">{podcastDate}</span>
              )}
              {!isPlaying && !currentTime && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#EA1D2C]/10 text-[9px] font-bold text-[#EA1D2C] uppercase tracking-wider animate-pulse">
                  <span className="w-1 h-1 rounded-full bg-[#EA1D2C]" />
                  Novo
                </span>
              )}
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-mono w-8">{fmt(currentTime)}</span>
              <div className="flex-1 h-1 bg-muted rounded-full cursor-pointer relative" onClick={handleSeek}>
                <div className="absolute inset-y-0 left-0 bg-[#EA1D2C] rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground font-mono w-8">{fmt(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-card rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-6 md:p-8 overflow-hidden">
      <audio ref={audioRef} preload="metadata" onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)} onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} onEnded={() => setIsPlaying(false)} onError={() => setError(true)}>
        <source src={audioUrl} type={audioUrl.endsWith(".wav") ? "audio/wav" : audioUrl.endsWith(".mp3") ? "audio/mpeg" : "audio/wav"} />
      </audio>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#EA1D2C]/[0.04] rounded-full blur-[80px] pointer-events-none" />

      <div className="relative flex items-start sm:items-center gap-4 sm:gap-6">
        {/* Play button */}
        <button onClick={togglePlay} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#EA1D2C] hover:bg-[#C41825] flex items-center justify-center flex-shrink-0 shadow-xl shadow-[#EA1D2C]/20 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer">
          {isPlaying ? (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#13151A]" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          ) : (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#13151A] ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#EA1D2C]/10 text-[10px] font-bold text-[#EA1D2C] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA1D2C] animate-pulse" />
              Podcast
            </span>
            {podcastDate && (
              <span className="text-[11px] text-muted-foreground">{podcastDate}</span>
            )}
          </div>
          <h3 className="font-heading text-lg sm:text-2xl font-bold text-foreground">Podcast Na Pista</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-2">{description}</p>

          {/* Progress bar */}
          <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-mono w-8 sm:w-10 text-right">{fmt(currentTime)}</span>
            <div className="flex-1 h-1 sm:h-1.5 bg-muted rounded-full cursor-pointer relative group/bar" onClick={handleSeek}>
              <div className="absolute inset-y-0 left-0 bg-[#EA1D2C] rounded-full transition-all" style={{ width: `${progress}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-background border border-border shadow-lg opacity-0 group-hover/bar:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-mono w-8 sm:w-10">{fmt(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
