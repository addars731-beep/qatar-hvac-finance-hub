import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, useFkOptions } from "@/components/crud-page";
import { useI18n } from "@/lib/i18n";
import { QAR } from "@/lib/format";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/inventory")({
  component: InventoryPage,
});

function InventoryPage() {
  const { t } = useI18n();
  const projects = useFkOptions("projects", "name");
  const materials = useFkOptions("materials", "name");
  return (
    <div>
      <Tabs defaultValue="materials">
        <TabsList className="mb-4">
          <TabsTrigger value="materials">{t("materials")}</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
        </TabsList>
        <TabsContent value="materials">
          <CrudPage
            config={{
              table: "materials",
              title: t("materials"),
              orderBy: { column: "name", ascending: true },
              fields: [
                { name: "code", label: t("code") },
                { name: "name", label: t("name"), required: true },
                { name: "category", label: t("category") },
                { name: "unit", label: "Unit", defaultValue: "pcs" },
                {
                  name: "unit_cost",
                  label: "Unit Cost",
                  type: "number",
                  formatter: (v) => QAR(Number(v ?? 0)),
                },
                { name: "reorder_level", label: "Reorder Level", type: "number" },
              ],
            }}
          />
        </TabsContent>
        <TabsContent value="movements">
          <CrudPage
            config={{
              table: "inventory_movements",
              title: "Stock Movements",
              orderBy: { column: "movement_date", ascending: false },
              fields: [
                { name: "movement_date", label: t("date"), type: "date", required: true, defaultValue: new Date().toISOString().slice(0, 10) },
                {
                  name: "material_id",
                  label: t("materials"),
                  type: "select",
                  required: true,
                  options: materials.data ?? [],
                },
                {
                  name: "movement_type",
                  label: "Type",
                  type: "select",
                  required: true,
                  options: [
                    { value: "in", label: "Stock In" },
                    { value: "out", label: "Issue to Site" },
                    { value: "transfer", label: "Transfer" },
                    { value: "return", label: "Return" },
                  ],
                },
                { name: "quantity", label: t("quantity"), type: "number", required: true },
                { name: "unit_cost", label: "Unit Cost", type: "number" },
                {
                  name: "project_id",
                  label: t("project"),
                  type: "select",
                  options: projects.data ?? [],
                },
                { name: "reference", label: "Reference" },
                { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
              ],
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}