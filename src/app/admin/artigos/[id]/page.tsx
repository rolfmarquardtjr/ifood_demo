import { verifyAuth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticleEditor } from "@/components/admin/article-editor";

export default async function AdminEditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAuth())) redirect("/admin");

  const { id } = await params;
  const articleId = parseInt(id);
  if (isNaN(articleId)) notFound();

  const db = getDb();
  const [article] = await db.select().from(articles).where(eq(articles.id, articleId)).limit(1);

  if (!article) notFound();

  return (
    <AdminShell>
      <ArticleEditor article={JSON.parse(JSON.stringify(article))} />
    </AdminShell>
  );
}
