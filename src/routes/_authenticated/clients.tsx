import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  const { t } = useI18n();
  return (
    <CrudPage
      config={{
        table: "clients",
        title: t("clients"),
        description: "Manage clients, contracts, and contact information.",
        orderBy: { column: "created_at", ascending: false },
        fields: [
          { name: "name", label: t("name"), required: true },
          { name: "company_name", label: t("company") },
          { name: "contact_person", label: t("contact") },
          { name: "mobile", label: t("mobile") },
          { name: "email", label: t("email"), type: "email" },
          { name: "vat_number", label: t("vatNumber") },
          { name: "address", label: t("address"), type: "textarea", hideInTable: true },
          { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
        ],
      }}
    />
  );
}