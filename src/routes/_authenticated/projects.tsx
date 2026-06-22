import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, useFkOptions } from "@/components/crud-page";
import { useI18n } from "@/lib/i18n";
import { QAR } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/projects")({
  component: ProjectsPage,
});

const statusColor: Record<string, string> = {
  tender: "bg-muted text-muted-foreground",
  approved: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  on_hold: "bg-orange-100 text-orange-700",
  completed: "bg-emerald-100 text-emerald-700",
  closed: "bg-zinc-200 text-zinc-700",
};

function ProjectsPage() {
  const { t } = useI18n();
  const clients = useFkOptions("clients", "name");
  return (
    <CrudPage
      config={{
        table: "projects",
        title: t("projects"),
        description: "All HVAC projects across sites in Qatar.",
        orderBy: { column: "created_at", ascending: false },
        fields: [
          { name: "code", label: t("code"), required: true },
          { name: "name", label: t("name"), required: true },
          { name: "client_id", label: t("client"), type: "select", options: clients.data ?? [], formatter: (_v, row) => row.clients?.name ?? "—" },
          { name: "site_location", label: t("site") },
          { name: "start_date", label: t("startDate"), type: "date", hideInTable: true },
          { name: "end_date", label: t("endDate"), type: "date", hideInTable: true },
          { name: "contract_value", label: t("contractValue"), type: "number", formatter: (v) => QAR(Number(v ?? 0)) },
          { name: "budget", label: t("budget"), type: "number", hideInTable: true },
          {
            name: "status",
            label: t("status"),
            type: "select",
            defaultValue: "tender",
            options: [
              { value: "tender", label: "Tender" },
              { value: "approved", label: "Approved" },
              { value: "in_progress", label: "In Progress" },
              { value: "on_hold", label: "On Hold" },
              { value: "completed", label: "Completed" },
              { value: "closed", label: "Closed" },
            ],
            formatter: (v) => (
              <Badge variant="secondary" className={statusColor[v as string] ?? ""}>
                {String(v ?? "").replace("_", " ")}
              </Badge>
            ),
          },
          { name: "description", label: t("description"), type: "textarea", hideInTable: true },
        ],
        select: "*, clients(name)",
      }}
    />
  );
}