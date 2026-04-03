import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { desc, count, eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminNewsletterPage() {
  if (!(await verifyAuth())) redirect("/admin");

  const db = getDb();
  const [activeCount] = await db.select({ count: count() }).from(subscribers).where(eq(subscribers.active, true));
  const allSubscribers = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-6">Newsletter</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Assinantes Ativos</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-emerald-500">{activeCount.count}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{allSubscribers.length}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSubscribers.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-mono text-sm">{sub.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={sub.active ? "text-emerald-500 border-emerald-500/20" : "text-red-500 border-red-500/20"}>
                      {sub.active ? "Ativo" : "Cancelado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {new Date(sub.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
