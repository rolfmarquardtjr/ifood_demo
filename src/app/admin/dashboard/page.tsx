import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { articles, podcasts, subscribers } from "@/lib/db/schema";
import { desc, eq, count, sql } from "drizzle-orm";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  if (!(await verifyAuth())) redirect("/admin");

  const db = getDb();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalArticles] = await db.select({ count: count() }).from(articles);
  const [totalSubscribers] = await db.select({ count: count() }).from(subscribers).where(eq(subscribers.active, true));
  const [totalPodcasts] = await db.select({ count: count() }).from(podcasts);

  const todayArticles = await db
    .select()
    .from(articles)
    .where(sql`${articles.createdAt} >= ${today}`)
    .orderBy(desc(articles.createdAt));

  const recentArticles = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.createdAt))
    .limit(5);

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Artigos Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{todayArticles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Artigos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalArticles.count}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assinantes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalSubscribers.count}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Podcasts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalPodcasts.count}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Artigos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentArticles.length > 0 ? (
            <div className="space-y-3">
              {recentArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{article.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {article.category} · {article.status} · {article.createdAt.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Nenhum artigo criado ainda.</p>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
