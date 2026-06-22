import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QAR } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { t } = useI18n();

  const { data: projectReport = [] } = useQuery({
    queryKey: ["report", "projects"],
    queryFn: async () => {
      const [{ data: projects }, { data: invoices }, { data: expenses }] = await Promise.all([
        supabase.from("projects").select("id, name, code, contract_value, status, clients(name)"),
        supabase.from("invoices").select("project_id, total_amount, paid_amount"),
        supabase.from("expenses").select("project_id, total_amount"),
      ]);
      return (projects ?? []).map((p: any) => {
        const inv = (invoices ?? []).filter((i: any) => i.project_id === p.id);
        const exp = (expenses ?? []).filter((e: any) => e.project_id === p.id);
        const revenue = inv.reduce((s, r: any) => s + Number(r.total_amount ?? 0), 0);
        const received = inv.reduce((s, r: any) => s + Number(r.paid_amount ?? 0), 0);
        const cost = exp.reduce((s, r: any) => s + Number(r.total_amount ?? 0), 0);
        const profit = revenue - cost;
        const pct = revenue > 0 ? (profit / revenue) * 100 : 0;
        return { ...p, revenue, received, cost, profit, pct };
      });
    },
  });

  const { data: clientReport = [] } = useQuery({
    queryKey: ["report", "clients"],
    queryFn: async () => {
      const [{ data: clients }, { data: invoices }, { data: expenses }, { data: projects }] = await Promise.all([
        supabase.from("clients").select("id, name, company_name"),
        supabase.from("invoices").select("client_id, project_id, total_amount, paid_amount"),
        supabase.from("expenses").select("project_id, total_amount"),
        supabase.from("projects").select("id, client_id"),
      ]);
      return (clients ?? []).map((c: any) => {
        const projIds = (projects ?? []).filter((p: any) => p.client_id === c.id).map((p: any) => p.id);
        const inv = (invoices ?? []).filter((i: any) => i.client_id === c.id);
        const exp = (expenses ?? []).filter((e: any) => projIds.includes(e.project_id));
        const revenue = inv.reduce((s, r: any) => s + Number(r.total_amount ?? 0), 0);
        const received = inv.reduce((s, r: any) => s + Number(r.paid_amount ?? 0), 0);
        const cost = exp.reduce((s, r: any) => s + Number(r.total_amount ?? 0), 0);
        const profit = revenue - cost;
        const pct = revenue > 0 ? (profit / revenue) * 100 : 0;
        return { ...c, revenue, received, outstanding: revenue - received, cost, profit, pct };
      });
    },
  });

  const { data: aging = [] } = useQuery({
    queryKey: ["report", "aging"],
    queryFn: async () => {
      const { data } = await supabase
        .from("invoices")
        .select("invoice_number, due_date, total_amount, paid_amount, clients(name)")
        .neq("status", "paid");
      const now = Date.now();
      return (data ?? []).map((i: any) => {
        const outstanding = Number(i.total_amount ?? 0) - Number(i.paid_amount ?? 0);
        const days = i.due_date ? Math.floor((now - new Date(i.due_date).getTime()) / 86400000) : 0;
        let bucket = "Current";
        if (days > 90) bucket = "90+";
        else if (days > 60) bucket = "61-90";
        else if (days > 30) bucket = "31-60";
        else if (days > 0) bucket = "0-30";
        return { ...i, outstanding, days, bucket };
      }).filter((r: any) => r.outstanding > 0);
    },
  });

  const exportCsv = (rows: any[], filename: string) => {
    if (!rows.length) return;
    const keys = Object.keys(rows[0]).filter((k) => typeof rows[0][k] !== "object" || rows[0][k] === null);
    const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  return (
    <div>
      <PageHeader title={t("reports")} description="Profitability, aging, cost reports." />
      <Tabs defaultValue="project">
        <TabsList className="mb-4">
          <TabsTrigger value="project">Project P&L</TabsTrigger>
          <TabsTrigger value="client">Client Profitability</TabsTrigger>
          <TabsTrigger value="aging">AR Aging</TabsTrigger>
        </TabsList>

        <TabsContent value="project">
          <Card className="p-4 shadow-[var(--shadow-card)]">
            <div className="flex justify-end mb-3">
              <button onClick={() => exportCsv(projectReport, "project-report.csv")} className="text-sm text-primary hover:underline">Export CSV</button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("code")}</TableHead>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("client")}</TableHead>
                  <TableHead className="text-end">{t("revenue")}</TableHead>
                  <TableHead className="text-end">Cost</TableHead>
                  <TableHead className="text-end">{t("profit")}</TableHead>
                  <TableHead className="text-end">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectReport.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.code}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.clients?.name ?? "—"}</TableCell>
                    <TableCell className="text-end">{QAR(p.revenue)}</TableCell>
                    <TableCell className="text-end">{QAR(p.cost)}</TableCell>
                    <TableCell className={`text-end font-semibold ${p.profit >= 0 ? "text-emerald-600" : "text-destructive"}`}>{QAR(p.profit)}</TableCell>
                    <TableCell className="text-end">{p.pct.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="client">
          <Card className="p-4 shadow-[var(--shadow-card)]">
            <div className="flex justify-end mb-3">
              <button onClick={() => exportCsv(clientReport, "client-report.csv")} className="text-sm text-primary hover:underline">Export CSV</button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("client")}</TableHead>
                  <TableHead className="text-end">{t("revenue")}</TableHead>
                  <TableHead className="text-end">Received</TableHead>
                  <TableHead className="text-end">Outstanding</TableHead>
                  <TableHead className="text-end">Cost</TableHead>
                  <TableHead className="text-end">{t("profit")}</TableHead>
                  <TableHead className="text-end">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientReport.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-end">{QAR(c.revenue)}</TableCell>
                    <TableCell className="text-end">{QAR(c.received)}</TableCell>
                    <TableCell className="text-end">{QAR(c.outstanding)}</TableCell>
                    <TableCell className="text-end">{QAR(c.cost)}</TableCell>
                    <TableCell className={`text-end font-semibold ${c.profit >= 0 ? "text-emerald-600" : "text-destructive"}`}>{QAR(c.profit)}</TableCell>
                    <TableCell className="text-end">{c.pct.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="aging">
          <Card className="p-4 shadow-[var(--shadow-card)]">
            <div className="flex justify-end mb-3">
              <button onClick={() => exportCsv(aging, "aging-report.csv")} className="text-sm text-primary hover:underline">Export CSV</button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("invoiceNumber")}</TableHead>
                  <TableHead>{t("client")}</TableHead>
                  <TableHead>{t("dueDate")}</TableHead>
                  <TableHead className="text-end">Outstanding</TableHead>
                  <TableHead className="text-end">Days</TableHead>
                  <TableHead>Bucket</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aging.map((r: any) => (
                  <TableRow key={r.invoice_number}>
                    <TableCell className="font-mono text-xs">{r.invoice_number}</TableCell>
                    <TableCell>{r.clients?.name ?? "—"}</TableCell>
                    <TableCell>{r.due_date ?? "—"}</TableCell>
                    <TableCell className="text-end font-semibold">{QAR(r.outstanding)}</TableCell>
                    <TableCell className="text-end">{r.days}</TableCell>
                    <TableCell>{r.bucket}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}