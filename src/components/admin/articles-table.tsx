"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: string;
  createdAt: Date;
}

const statusColors: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  draft: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  unpublished: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function ArticlesTable({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<number | null>(null);

  const updateStatus = async (id: number, status: string) => {
    setLoading(id);
    await fetch("/api/admin/articles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setLoading(null);
    router.refresh();
  };

  const deleteArticle = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este artigo?")) return;
    setLoading(id);
    await fetch(`/api/admin/articles?id=${id}`, { method: "DELETE" });
    setLoading(null);
    router.refresh();
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="w-20">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                Nenhum artigo encontrado.
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article) => (
              <TableRow key={article.id} className={loading === article.id ? "opacity-50" : ""}>
                <TableCell className="font-medium max-w-xs truncate">{article.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{article.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[article.status] || ""}>
                    {article.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground font-mono">
                  {new Date(article.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 px-2 hover:bg-accent hover:text-accent-foreground cursor-pointer">
                      ···
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/admin/artigos/${article.id}`)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(`/artigo/${article.slug}`, "_blank")}>
                        Ver no blog
                      </DropdownMenuItem>
                      {article.status === "published" && (
                        <DropdownMenuItem onClick={() => updateStatus(article.id, "unpublished")}>
                          Despublicar
                        </DropdownMenuItem>
                      )}
                      {article.status !== "published" && (
                        <DropdownMenuItem onClick={() => updateStatus(article.id, "published")}>
                          Publicar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteArticle(article.id)}>
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
