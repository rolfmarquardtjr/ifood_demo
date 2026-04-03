"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Podcast {
  id: number;
  title: string;
  description: string;
  audioUrl: string;
  durationSeconds: number | null;
  script: Array<{ speaker: string; text: string }> | null;
  articleIds: number[] | null;
  status: string;
  createdAt: string;
}

interface ArticleOption {
  id: number;
  title: string;
  createdAt: string;
}

export function PodcastManager({ podcasts, articles }: { podcasts: Podcast[]; articles: ArticleOption[] }) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [expandedScript, setExpandedScript] = useState<number | null>(null);

  const toggleArticle = (id: number) => {
    setSelectedArticles((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/generate/podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleIds: selectedArticles.length > 0 ? selectedArticles : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar podcast");
      router.refresh();
      setSelectedArticles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generate section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gerar Novo Podcast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Selecione os artigos para discutir no podcast. Se nenhum for selecionado, os 3 mais recentes serao usados.
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {articles.map((article) => (
                <label
                  key={article.id}
                  className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                    selectedArticles.includes(article.id)
                      ? "border-[#EA1D2C] bg-[#EA1D2C]/5"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedArticles.includes(article.id)}
                    onChange={() => toggleArticle(article.id)}
                    className="accent-[#EA1D2C]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{article.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
              {error}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-[#EA1D2C] hover:bg-[#EA1D2C]/90"
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Gerando podcast... (pode levar alguns minutos)
              </span>
            ) : (
              "Gerar Podcast"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Episodes list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Episódios</CardTitle>
        </CardHeader>
        <CardContent>
          {podcasts.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum podcast gerado ainda.</p>
          ) : (
            <div className="space-y-3">
              {podcasts.map((p) => (
                <div key={p.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{p.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString("pt-BR")} ·{" "}
                        {p.durationSeconds ? `${Math.floor(p.durationSeconds / 60)}min` : "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={p.status === "published" ? "text-emerald-500" : "text-yellow-500"}>
                        {p.status}
                      </Badge>
                      {p.audioUrl && (
                        <a href={p.audioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#EA1D2C] hover:underline">
                          Ouvir
                        </a>
                      )}
                    </div>
                  </div>

                  {p.description && (
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  )}

                  {p.script && p.script.length > 0 && (
                    <div>
                      <button
                        onClick={() => setExpandedScript(expandedScript === p.id ? null : p.id)}
                        className="text-xs text-[#EA1D2C] hover:underline cursor-pointer"
                      >
                        {expandedScript === p.id ? "Ocultar roteiro" : `Ver roteiro (${p.script.length} falas)`}
                      </button>
                      {expandedScript === p.id && (
                        <div className="mt-2 space-y-1 max-h-64 overflow-y-auto bg-muted/30 rounded-lg p-3">
                          {p.script.map((line, i) => (
                            <p key={i} className="text-xs">
                              <span className="font-semibold text-[#EA1D2C]">{line.speaker}:</span>{" "}
                              <span className="text-muted-foreground">{line.text}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
