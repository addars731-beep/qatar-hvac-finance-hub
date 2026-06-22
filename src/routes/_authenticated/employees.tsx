import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";
import { useI18n } from "@/lib/i18n";
import { QAR } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/employees")({
  component: EmployeesPage,
});

function EmployeesPage() {
  const { t } = useI18n();
  return (
    <CrudPage
      config={{
        table: "employees",
        title: t("employees"),
        description: "Staff, technicians, engineers and labor force.",
        orderBy: { column: "created_at", ascending: false },
        fields: [
          { name: "employee_code", label: "Code" },
          { name: "full_name", label: t("name"), required: true },
          { name: "designation", label: t("designation") },
          { name: "mobile", label: t("mobile") },
          { name: "nationality", label: "Nationality", hideInTable: true },
          { name: "qid", label: "QID", hideInTable: true },
          { name: "qid_expiry", label: "QID Expiry", type: "date", hideInTable: true },
          { name: "visa_number", label: "Visa No", hideInTable: true },
          { name: "visa_expiry", label: "Visa Expiry", type: "date", hideInTable: true },
          { name: "basic_salary", label: t("salary"), type: "number", formatter: (v) => QAR(Number(v ?? 0)) },
          { name: "allowances", label: "Allowances", type: "number", hideInTable: true },
          { name: "accommodation", label: "Accommodation", hideInTable: true },
          { name: "joining_date", label: "Joining Date", type: "date", hideInTable: true },
          {
            name: "status",
            label: t("status"),
            type: "select",
            defaultValue: "active",
            options: [
              { value: "active", label: "Active" },
              { value: "on_leave", label: "On Leave" },
              { value: "terminated", label: "Terminated" },
            ],
          },
        ],
      }}
    />
  );
}