import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { sources } from "@/lib/db/schema";
import { AdminShell } from "@/components/admin/admin-shell";
import { SourcesManager } from "@/components/admin/sources-manager";

export default async function AdminSourcesPage() {
  if (!(await verifyAuth())) redirect("/admin");

  const db = getDb();
  const allSources = await db.select().from(sources);

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-6">Fontes de Notícias</h1>
      <SourcesManager sources={allSources} />
    </AdminShell>
  );
}
