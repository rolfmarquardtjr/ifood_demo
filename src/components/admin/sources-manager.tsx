"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Source {
  id: number;
  name: string;
  url: string;
  category: string;
  selector: string | null;
  active: boolean;
  lastScrapedAt: Date | null;
}

export function SourcesManager({ sources: initialSources }: { sources: Source[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("seguranca");
  const [selector, setSelector] = useState("");
  const [loading, setLoading] = useState(false);

  const addSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url, category, selector: selector || null }),
    });
    setLoading(false);
    setDialogOpen(false);
    setName(""); setUrl(""); setCategory("seguranca"); setSelector("");
    router.refresh();
  };

  const toggleActive = async (id: number, active: boolean) => {
    await fetch("/api/admin/sources", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    router.refresh();
  };

  const deleteSource = async (id: number) => {
    if (!confirm("Excluir esta fonte?")) return;
    await fetch(`/api/admin/sources?id=${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 bg-[#EA1D2C] hover:bg-[#EA1D2C]/90 text-white cursor-pointer">
            + Adicionar Fonte
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Fonte de Notícias</DialogTitle>
            </DialogHeader>
            <form onSubmit={addSource} className="space-y-4">
              <div><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Portal Logística" required className="mt-1" /></div>
              <div><Label>URL</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" required className="mt-1" /></div>
              <div>
                <Label>Categoria</Label>
                <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seguranca">Segurança no Trânsito</SelectItem>
                    <SelectItem value="prevencao">Prevenção de Acidentes</SelectItem>
                    <SelectItem value="conscientizacao">Conscientização</SelectItem>
                    <SelectItem value="geral">Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>CSS Selector (opcional)</Label><Input value={selector} onChange={(e) => setSelector(e.target.value)} placeholder="article h2 a" className="mt-1 font-mono text-sm" /></div>
              <Button type="submit" disabled={loading} className="w-full bg-[#EA1D2C] hover:bg-[#EA1D2C]/90">
                {loading ? "Salvando..." : "Adicionar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="w-20">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialSources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhuma fonte cadastrada.</TableCell>
                </TableRow>
              ) : (
                initialSources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">{source.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate font-mono">{source.url}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{source.category}</Badge></TableCell>
                    <TableCell>
                      <Switch checked={source.active} onCheckedChange={(checked) => toggleActive(source.id, checked)} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteSource(source.id)}>
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
