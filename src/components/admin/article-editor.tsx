"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ArticleSource {
  url: string;
  title: string;
  site: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  imageUrl: string | null;
  imageSource: string | null;
  audioUrl: string | null;
  sources: ArticleSource[];
  status: string;
  aiModel: string | null;
  createdAt: string;
  updatedAt: string;
}

export function ArticleEditor({ article }: { article: Article }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [summary, setSummary] = useState(article.summary);
  const [content, setContent] = useState(article.content);
  const [category, setCategory] = useState(article.category);
  const [status, setStatus] = useState(article.status);
  const [imageUrl, setImageUrl] = useState(article.imageUrl || "");
  const [sources, setSources] = useState<ArticleSource[]>(article.sources || []);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: article.id,
          title,
          slug,
          summary,
          content,
          category,
          status,
          imageUrl: imageUrl || null,
          sources,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const updateSource = (index: number, field: keyof ArticleSource, value: string) => {
    const updated = [...sources];
    updated[index] = { ...updated[index], [field]: value };
    setSources(updated);
  };

  const addSource = () => {
    setSources([...sources, { url: "", title: "", site: "" }]);
  };

  const removeSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.push("/admin/artigos")} className="px-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Editar Artigo</h1>
          <Badge variant="outline" className="capitalize">{category}</Badge>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-emerald-500">Salvo com sucesso</span>}
          <Button onClick={handleSave} disabled={saving} className="bg-[#EA1D2C] hover:bg-[#EA1D2C]/90">
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label>Titulo</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 font-mono text-sm" />
              </div>
              <div>
                <Label>Resumo</Label>
                <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="mt-1" />
              </div>
              <div>
                <Label>Conteudo (Markdown)</Label>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={20} className="mt-1 font-mono text-sm" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Fontes</Label>
                <Button variant="ghost" size="sm" onClick={addSource} className="text-[#EA1D2C]">
                  + Adicionar
                </Button>
              </div>
              {sources.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma fonte adicionada.</p>
              )}
              {sources.map((source, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-end">
                  <div>
                    <Label className="text-xs text-muted-foreground">Titulo</Label>
                    <Input value={source.title} onChange={(e) => updateSource(i, "title", e.target.value)} placeholder="Titulo da fonte" className="mt-1 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">URL</Label>
                    <Input value={source.url} onChange={(e) => updateSource(i, "url", e.target.value)} placeholder="https://..." className="mt-1 text-sm font-mono" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Site</Label>
                    <Input value={source.site} onChange={(e) => updateSource(i, "site", e.target.value)} placeholder="Nome do site" className="mt-1 text-sm" />
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive mb-0.5" onClick={() => removeSource(i)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => v && setStatus(v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="unpublished">Despublicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delivery">Logística & Entrega</SelectItem>
                    <SelectItem value="restaurantes">Restaurantes & Parceiros</SelectItem>
                    <SelectItem value="tendencias">Tendências & Inovação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>URL da Imagem</Label>
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." className="mt-1 text-sm font-mono" />
                {imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-border">
                    <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>
              <div className="border-t border-border pt-4">
                <Label className="text-xs text-muted-foreground">Gerar imagem com IA</Label>
                <Input
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder={title || "Descreva a imagem desejada..."}
                  className="mt-1 text-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full text-[#EA1D2C] border border-[#EA1D2C]/30 hover:bg-[#EA1D2C]/10"
                  disabled={generatingImage}
                  onClick={async () => {
                    setGeneratingImage(true);
                    try {
                      const res = await fetch("/api/admin/generate/image", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          prompt: imagePrompt || title,
                          articleId: article.id,
                        }),
                      });
                      const data = await res.json();
                      if (res.ok && data.imageUrl) {
                        setImageUrl(data.imageUrl);
                      } else {
                        alert(data.error || "Erro ao gerar imagem");
                      }
                    } catch {
                      alert("Erro ao gerar imagem");
                    } finally {
                      setGeneratingImage(false);
                    }
                  }}
                >
                  {generatingImage ? "Gerando..." : "Gerar Imagem"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono">{article.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Modelo IA</span>
                <span className="font-mono text-xs">{article.aiModel || "-"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Criado em</span>
                <span className="font-mono">{new Date(article.createdAt).toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Atualizado em</span>
                <span className="font-mono">{new Date(article.updatedAt).toLocaleDateString("pt-BR")}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
