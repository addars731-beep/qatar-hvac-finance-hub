import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, useFkOptions } from "@/components/crud-page";
import { useI18n } from "@/lib/i18n";
import { QAR } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/payroll")({
  component: PayrollPage,
});

function PayrollPage() {
  const { t } = useI18n();
  const employees = useFkOptions("employees", "full_name");
  return (
    <CrudPage
      config={{
        table: "payroll",
        title: t("payroll"),
        description: "Monthly salaries, overtime, deductions and net pay.",
        orderBy: { column: "created_at", ascending: false },
        fields: [
          { name: "employee_id", label: "Employee", type: "select", required: true, options: employees.data ?? [] },
          { name: "period_month", label: "Month (1-12)", type: "number", required: true },
          { name: "period_year", label: "Year", type: "number", required: true, defaultValue: new Date().getFullYear() },
          { name: "basic_salary", label: "Basic", type: "number", formatter: (v) => QAR(Number(v ?? 0)) },
          { name: "allowances", label: "Allowances", type: "number", hideInTable: true },
          { name: "overtime_amount", label: "Overtime", type: "number", hideInTable: true },
          { name: "deductions", label: "Deductions", type: "number", hideInTable: true },
          { name: "advances", label: "Advances", type: "number", hideInTable: true },
          { name: "net_salary", label: "Net Salary", type: "number", required: true, formatter: (v) => QAR(Number(v ?? 0)) },
          {
            name: "status",
            label: t("status"),
            type: "select",
            defaultValue: "draft",
            options: [
              { value: "draft", label: "Draft" },
              { value: "approved", label: "Approved" },
              { value: "paid", label: "Paid" },
            ],
          },
          { name: "paid_date", label: "Paid Date", type: "date", hideInTable: true },
        ],
      }}
    />
  );
}