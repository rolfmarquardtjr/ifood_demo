import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticlesTable } from "@/components/admin/articles-table";

export default async function AdminArticlesPage() {
  if (!(await verifyAuth())) redirect("/admin");

  const db = getDb();
  const allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt));

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-6">Artigos</h1>
      <ArticlesTable articles={allArticles} />
    </AdminShell>
  );
}
