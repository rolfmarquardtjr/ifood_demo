import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { podcasts, articles } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/admin-shell";
import { PodcastManager } from "@/components/admin/podcast-manager";

export default async function AdminPodcastPage() {
  if (!(await verifyAuth())) redirect("/admin");

  const db = getDb();
  const allPodcasts = await db.select().from(podcasts).orderBy(desc(podcasts.createdAt)).limit(20);
  const publishedArticles = await db
    .select({ id: articles.id, title: articles.title, createdAt: articles.createdAt })
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.createdAt))
    .limit(20);

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-6">Podcasts</h1>
      <PodcastManager
        podcasts={JSON.parse(JSON.stringify(allPodcasts))}
        articles={JSON.parse(JSON.stringify(publishedArticles))}
      />
    </AdminShell>
  );
}
