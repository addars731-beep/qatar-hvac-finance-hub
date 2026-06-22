import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, useFkOptions } from "@/components/crud-page";
import { useI18n } from "@/lib/i18n";
import { QAR } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: ExpensesPage,
});

function ExpensesPage() {
  const { t } = useI18n();
  const projects = useFkOptions("projects", "name");
  const vendors = useFkOptions("vendors", "name");

  return (
    <CrudPage
      config={{
        table: "expenses",
        title: t("expenses"),
        description: "Site-wise expense tracking with VAT and approvals.",
        orderBy: { column: "expense_date", ascending: false },
        fields: [
          { name: "expense_date", label: t("date"), type: "date", required: true, defaultValue: new Date().toISOString().slice(0, 10) },
          {
            name: "category",
            label: t("category"),
            type: "select",
            required: true,
            options: [
              { value: "labor", label: "Labor" },
              { value: "materials", label: "Materials" },
              { value: "transport", label: "Transport" },
              { value: "machinery", label: "Machinery" },
              { value: "accommodation", label: "Accommodation" },
              { value: "office_overhead", label: "Office Overhead" },
              { value: "miscellaneous", label: "Miscellaneous" },
            ],
            formatter: (v) => <Badge variant="outline">{String(v).replace("_", " ")}</Badge>,
          },
          { name: "subcategory", label: "Subcategory", hideInTable: true },
          { name: "description", label: t("description") },
          { name: "amount", label: t("amount"), type: "number", required: true, formatter: (v) => QAR(Number(v ?? 0)) },
          { name: "vat_amount", label: t("vat"), type: "number", defaultValue: 0, hideInTable: true },
          {
            name: "project_id",
            label: t("project"),
            type: "select",
            options: projects.data ?? [],
          },
          {
            name: "vendor_id",
            label: t("vendor"),
            type: "select",
            options: vendors.data ?? [],
            hideInTable: true,
          },
          {
            name: "payment_method",
            label: t("paymentMethod"),
            type: "select",
            defaultValue: "cash",
            options: [
              { value: "cash", label: "Cash" },
              { value: "bank_transfer", label: "Bank Transfer" },
              { value: "cheque", label: "Cheque" },
              { value: "card", label: "Card" },
              { value: "other", label: "Other" },
            ],
            hideInTable: true,
          },
          { name: "reference_no", label: "Reference", hideInTable: true },
          {
            name: "status",
            label: t("status"),
            type: "select",
            defaultValue: "submitted",
            options: [
              { value: "submitted", label: "Submitted" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ],
            formatter: (v) => (
              <Badge variant={v === "approved" ? "default" : v === "rejected" ? "destructive" : "secondary"}>
                {String(v)}
              </Badge>
            ),
          },
          { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
        ],
      }}
    />
  );
}