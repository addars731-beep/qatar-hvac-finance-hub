import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, useFkOptions } from "@/components/crud-page";
import { useI18n } from "@/lib/i18n";
import { QAR } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/purchase-orders")({
  component: POPage,
});

function POPage() {
  const { t } = useI18n();
  const vendors = useFkOptions("vendors", "name");
  const projects = useFkOptions("projects", "name");
  return (
    <CrudPage
      config={{
        table: "purchase_orders",
        title: t("purchaseOrders"),
        description: "Track POs, expected delivery and totals.",
        orderBy: { column: "order_date", ascending: false },
        fields: [
          { name: "po_number", label: "PO #", required: true },
          { name: "vendor_id", label: t("vendor"), type: "select", options: vendors.data ?? [] },
          { name: "project_id", label: t("project"), type: "select", options: projects.data ?? [] },
          { name: "order_date", label: t("date"), type: "date", required: true, defaultValue: new Date().toISOString().slice(0, 10) },
          { name: "expected_date", label: "Expected", type: "date" },
          { name: "total_amount", label: t("total"), type: "number", formatter: (v) => QAR(Number(v ?? 0)) },
          {
            name: "status",
            label: t("status"),
            type: "select",
            defaultValue: "open",
            options: [
              { value: "open", label: "Open" },
              { value: "partial", label: "Partially Received" },
              { value: "received", label: "Received" },
              { value: "cancelled", label: "Cancelled" },
            ],
          },
          { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
        ],
      }}
    />
  );
}