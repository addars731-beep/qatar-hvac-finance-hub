import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, useFkOptions } from "@/components/crud-page";
import { useI18n } from "@/lib/i18n";
import { QAR } from "@/lib/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const { t } = useI18n();
  const clients = useFkOptions("clients", "name");
  const invoices = useFkOptions("invoices", "invoice_number");
  const vendors = useFkOptions("vendors", "name");
  const bills = useFkOptions("vendor_bills", "bill_number");

  return (
    <Tabs defaultValue="received">
      <TabsList className="mb-4">
        <TabsTrigger value="received">Payments Received</TabsTrigger>
        <TabsTrigger value="bills">Vendor Bills</TabsTrigger>
        <TabsTrigger value="paid">Payments Made</TabsTrigger>
      </TabsList>
      <TabsContent value="received">
        <CrudPage
          config={{
            table: "payments_received",
            title: "Payments Received",
            description: "Track payments received from clients.",
            orderBy: { column: "payment_date", ascending: false },
            fields: [
              { name: "payment_date", label: t("date"), type: "date", required: true, defaultValue: new Date().toISOString().slice(0, 10) },
              { name: "client_id", label: t("client"), type: "select", options: clients.data ?? [] },
              { name: "invoice_id", label: t("invoiceNumber"), type: "select", options: invoices.data ?? [] },
              { name: "amount", label: t("amount"), type: "number", required: true, formatter: (v) => QAR(Number(v ?? 0)) },
              {
                name: "method",
                label: t("paymentMethod"),
                type: "select",
                defaultValue: "bank_transfer",
                options: [
                  { value: "cash", label: "Cash" },
                  { value: "bank_transfer", label: "Bank Transfer" },
                  { value: "cheque", label: "Cheque" },
                  { value: "card", label: "Card" },
                ],
              },
              { name: "reference_no", label: "Reference" },
              { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
            ],
          }}
        />
      </TabsContent>
      <TabsContent value="bills">
        <CrudPage
          config={{
            table: "vendor_bills",
            title: "Vendor Bills",
            description: "Bills received from vendors and subcontractors.",
            orderBy: { column: "bill_date", ascending: false },
            fields: [
              { name: "bill_number", label: "Bill #" },
              { name: "vendor_id", label: t("vendor"), type: "select", required: true, options: vendors.data ?? [] },
              { name: "bill_date", label: t("date"), type: "date", required: true, defaultValue: new Date().toISOString().slice(0, 10) },
              { name: "due_date", label: t("dueDate"), type: "date" },
              { name: "amount", label: t("amount"), type: "number", defaultValue: 0 },
              { name: "vat_amount", label: t("vat"), type: "number", defaultValue: 0, hideInTable: true },
              { name: "total_amount", label: t("total"), type: "number", required: true, formatter: (v) => QAR(Number(v ?? 0)) },
              { name: "paid_amount", label: t("paid"), type: "number", defaultValue: 0, formatter: (v) => QAR(Number(v ?? 0)) },
              {
                name: "status",
                label: t("status"),
                type: "select",
                defaultValue: "unpaid",
                options: [
                  { value: "unpaid", label: "Unpaid" },
                  { value: "partial", label: "Partial" },
                  { value: "paid", label: "Paid" },
                ],
              },
              { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
            ],
          }}
        />
      </TabsContent>
      <TabsContent value="paid">
        <CrudPage
          config={{
            table: "bill_payments",
            title: "Payments Made",
            description: "Payments made to vendors.",
            orderBy: { column: "payment_date", ascending: false },
            fields: [
              { name: "payment_date", label: t("date"), type: "date", required: true, defaultValue: new Date().toISOString().slice(0, 10) },
              { name: "vendor_id", label: t("vendor"), type: "select", options: vendors.data ?? [] },
              { name: "bill_id", label: "Bill", type: "select", options: bills.data ?? [] },
              { name: "amount", label: t("amount"), type: "number", required: true, formatter: (v) => QAR(Number(v ?? 0)) },
              {
                name: "method",
                label: t("paymentMethod"),
                type: "select",
                defaultValue: "bank_transfer",
                options: [
                  { value: "cash", label: "Cash" },
                  { value: "bank_transfer", label: "Bank Transfer" },
                  { value: "cheque", label: "Cheque" },
                ],
              },
              { name: "reference_no", label: "Reference" },
            ],
          }}
        />
      </TabsContent>
    </Tabs>
  );
}