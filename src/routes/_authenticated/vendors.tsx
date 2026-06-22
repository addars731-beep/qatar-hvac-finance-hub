import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/vendors")({
  component: VendorsPage,
});

function VendorsPage() {
  const { t } = useI18n();
  return (
    <CrudPage
      config={{
        table: "vendors",
        title: t("vendors"),
        description: "Suppliers, subcontractors and service providers.",
        orderBy: { column: "created_at", ascending: false },
        fields: [
          { name: "name", label: t("name"), required: true },
          { name: "contact_person", label: t("contact") },
          { name: "mobile", label: t("mobile") },
          { name: "email", label: t("email"), type: "email" },
          { name: "vat_number", label: t("vatNumber") },
          { name: "bank_name", label: "Bank", hideInTable: true },
          { name: "iban", label: "IBAN", hideInTable: true },
          { name: "address", label: t("address"), type: "textarea", hideInTable: true },
        ],
      }}
    />
  );
}