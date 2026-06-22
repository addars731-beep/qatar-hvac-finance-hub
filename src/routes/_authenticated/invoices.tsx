import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, useFkOptions } from "@/components/crud-page";
import { useI18n } from "@/lib/i18n";
import { QAR } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/invoices")({
  component: InvoicesPage,
});

function InvoicesPage() {
  const { t } = useI18n();
  const clients = useFkOptions("clients", "name");
  const projects = useFkOptions("projects", "name");

  return (
    <CrudPage
      config={{
        table: "invoices",
        title: t("invoices"),
        description: "Proforma, tax, progress and final invoices.",
        orderBy: { column: "issue_date", ascending: false },
        select: "*, clients(name), projects(name)",
        fields: [
          { name: "invoice_number", label: t("invoiceNumber"), required: true },
          {
            name: "invoice_type",
            label: "Type",
            type: "select",
            defaultValue: "tax",
            options: [
              { value: "proforma", label: "Proforma" },
              { value: "tax", label: "Tax Invoice" },
              { value: "progress", label: "Progress" },
              { value: "final", label: "Final" },
            ],
          },
          { name: "client_id", label: t("client"), type: "select", required: true, options: clients.data ?? [], formatter: (_v, row) => row.clients?.name ?? "—" },
          { name: "project_id", label: t("project"), type: "select", options: projects.data ?? [], formatter: (_v, row) => row.projects?.name ?? "—" },
          { name: "issue_date", label: t("issueDate"), type: "date", required: true, defaultValue: new Date().toISOString().slice(0, 10) },
          { name: "due_date", label: t("dueDate"), type: "date" },
          { name: "subtotal", label: "Subtotal", type: "number", defaultValue: 0, formatter: (v) => QAR(Number(v ?? 0)), hideInTable: true },
          { name: "vat_amount", label: t("vat"), type: "number", defaultValue: 0, hideInTable: true },
          { name: "total_amount", label: t("total"), type: "number", required: true, formatter: (v) => QAR(Number(v ?? 0)) },
          { name: "paid_amount", label: t("paid"), type: "number", defaultValue: 0, formatter: (v) => QAR(Number(v ?? 0)) },
          {
            name: "status",
            label: t("status"),
            type: "select",
            defaultValue: "draft",
            options: [
              { value: "draft", label: "Draft" },
              { value: "sent", label: "Sent" },
              { value: "partially_paid", label: "Partially Paid" },
              { value: "paid", label: "Paid" },
              { value: "overdue", label: "Overdue" },
              { value: "cancelled", label: "Cancelled" },
            ],
            formatter: (v) => {
              const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
                paid: "default", sent: "secondary", draft: "outline", overdue: "destructive", partially_paid: "secondary", cancelled: "outline",
              };
              return <Badge variant={map[v as string] ?? "secondary"}>{String(v).replace("_", " ")}</Badge>;
            },
          },
          { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
          { name: "terms", label: "Terms", type: "textarea", hideInTable: true },
        ],
      }}
    />
  );
}