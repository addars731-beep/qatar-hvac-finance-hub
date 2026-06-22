import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, useFkOptions } from "@/components/crud-page";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  const { t } = useI18n();
  const employees = useFkOptions("employees", "full_name");
  const projects = useFkOptions("projects", "name");
  return (
    <CrudPage
      config={{
        table: "attendance",
        title: t("attendance"),
        description: "Daily attendance and overtime tracking.",
        orderBy: { column: "date", ascending: false },
        fields: [
          { name: "date", label: t("date"), type: "date", required: true, defaultValue: new Date().toISOString().slice(0, 10) },
          { name: "employee_id", label: "Employee", type: "select", required: true, options: employees.data ?? [] },
          { name: "project_id", label: t("project"), type: "select", options: projects.data ?? [] },
          { name: "hours_worked", label: "Hours", type: "number", defaultValue: 8 },
          { name: "overtime_hours", label: "Overtime", type: "number", defaultValue: 0 },
          {
            name: "status",
            label: t("status"),
            type: "select",
            defaultValue: "present",
            options: [
              { value: "present", label: "Present" },
              { value: "absent", label: "Absent" },
              { value: "leave", label: "Leave" },
              { value: "off", label: "Off Day" },
            ],
          },
          { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
        ],
      }}
    />
  );
}