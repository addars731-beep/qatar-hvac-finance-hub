import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  FileText,
  Briefcase,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { QAR } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const Route = createFileRoute("/_authenticated/")({
  component: Dashboard,
});

function Dashboard() {
  const { t } = useI18n();

  const { data: stats } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const [inv, exp, pr, pj, expCat] = await Promise.all([
        supabase.from("invoices").select("total_amount, paid_amount, status"),
        supabase.from("expenses").select("total_amount, category, expense_date"),
        supabase.from("payments_received").select("amount, payment_date"),
        supabase.from("projects").select("status, contract_value"),
        supabase.from("vendor_bills").select("total_amount, paid_amount"),
      ]);

      const invoices = inv.data ?? [];
      const expenses = exp.data ?? [];
      const payments = pr.data ?? [];
      const projects = pj.data ?? [];
      const bills = expCat.data ?? [];

      const totalRevenue = invoices.reduce((s, r) => s + Number(r.total_amount ?? 0), 0);
      const totalReceived = invoices.reduce((s, r) => s + Number(r.paid_amount ?? 0), 0);
      const receivables = totalRevenue - totalReceived;
      const totalExpenses = expenses.reduce((s, r) => s + Number(r.total_amount ?? 0), 0);
      const grossProfit = totalRevenue - totalExpenses;
      const totalBills = bills.reduce((s, r) => s + Number(r.total_amount ?? 0), 0);
      const billsPaid = bills.reduce((s, r) => s + Number(r.paid_amount ?? 0), 0);
      const payables = totalBills - billsPaid;
      const activeProjects = projects.filter((p) => ["approved", "in_progress"].includes(p.status as string)).length;
      const completedProjects = projects.filter((p) => p.status === "completed" || p.status === "closed").length;

      // Monthly cashflow (last 6 months)
      const months: Record<string, { name: string; revenue: number; expenses: number }> = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        months[key] = {
          name: d.toLocaleDateString("en", { month: "short" }),
          revenue: 0,
          expenses: 0,
        };
      }
      for (const p of payments) {
        const d = new Date(p.payment_date as string);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (months[key]) months[key].revenue += Number(p.amount ?? 0);
      }
      for (const e of expenses) {
        const d = new Date(e.expense_date as string);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (months[key]) months[key].expenses += Number(e.total_amount ?? 0);
      }

      // Expense breakdown by category
      const catMap: Record<string, number> = {};
      for (const e of expenses) {
        const k = (e.category as string) ?? "other";
        catMap[k] = (catMap[k] ?? 0) + Number(e.total_amount ?? 0);
      }
      const expenseByCat = Object.entries(catMap).map(([name, value]) => ({ name, value }));

      return {
        totalRevenue,
        totalExpenses,
        grossProfit,
        receivables,
        payables,
        activeProjects,
        completedProjects,
        monthly: Object.values(months),
        expenseByCat,
      };
    },
  });

  const colors = ["#1E40AF", "#3B82F6", "#60A5FA", "#93C5FD", "#0EA5E9", "#06B6D4", "#14B8A6"];

  return (
    <div>
      <PageHeader title={t("dashboard")} description="Real-time financial & project overview" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label={t("totalRevenue")} value={QAR(stats?.totalRevenue ?? 0)} icon={TrendingUp} tone="success" />
        <StatCard label={t("totalExpenses")} value={QAR(stats?.totalExpenses ?? 0)} icon={TrendingDown} tone="destructive" />
        <StatCard label={t("grossProfit")} value={QAR(stats?.grossProfit ?? 0)} icon={Wallet} tone={stats && stats.grossProfit >= 0 ? "success" : "destructive"} />
        <StatCard label={t("receivables")} value={QAR(stats?.receivables ?? 0)} icon={Receipt} tone="warning" />
        <StatCard label={t("payables")} value={QAR(stats?.payables ?? 0)} icon={FileText} tone="warning" />
        <StatCard label={t("activeProjects")} value={String(stats?.activeProjects ?? 0)} icon={Briefcase} />
        <StatCard label={t("completedProjects")} value={String(stats?.completedProjects ?? 0)} icon={CheckCircle2} tone="success" />
        <StatCard label="Net Cashflow (6m)" value={QAR((stats?.monthly ?? []).reduce((s, m) => s + m.revenue - m.expenses, 0))} icon={AlertCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2 shadow-[var(--shadow-card)]">
          <h3 className="font-semibold mb-4">{t("monthlyCashFlow")} (6 months)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthly ?? []}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => QAR(Number(v))} />
                <Legend />
                <Bar dataKey="revenue" fill="#1E40AF" name={t("revenue")} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" name={t("totalExpenses")} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5 shadow-[var(--shadow-card)]">
          <h3 className="font-semibold mb-4">Expense Breakdown</h3>
          <div className="h-72">
            {stats?.expenseByCat?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.expenseByCat} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {stats.expenseByCat.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => QAR(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">{t("noData")}</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}