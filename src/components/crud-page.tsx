import { useState, type ReactNode } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "./page-header";
import { useI18n } from "@/lib/i18n";

export type FieldType = "text" | "number" | "date" | "select" | "textarea" | "email";

export interface CrudField {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  defaultValue?: any;
  hideInTable?: boolean;
  formatter?: (v: any, row: any) => ReactNode;
}

export interface CrudConfig {
  table: string;
  title: string;
  description?: string;
  fields: CrudField[];
  orderBy?: { column: string; ascending?: boolean };
  searchableColumns?: string[];
  select?: string;
  extraActions?: (row: any) => ReactNode;
  rowFormatter?: (row: any) => any;
}

export function CrudPage({ config }: { config: CrudConfig }) {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: [config.table, "list"],
    queryFn: async () => {
      let q: any = supabase.from(config.table as any).select(config.select ?? "*");
      if (config.orderBy)
        q = q.order(config.orderBy.column, { ascending: config.orderBy.ascending ?? false });
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (payload: any) => {
      const cleaned: Record<string, any> = {};
      for (const f of config.fields) {
        let v = payload[f.name];
        if (v === "" || v === undefined) v = null;
        if (f.type === "number" && v !== null) v = Number(v);
        cleaned[f.name] = v;
      }
      if (editing?.id) {
        const { error } = await supabase.from(config.table as any).update(cleaned).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(config.table as any).insert(cleaned);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [config.table] });
      toast.success("Saved");
      setOpen(false);
      setEditing(null);
      setForm({});
    },
    onError: (e: any) => toast.error(e.message ?? "Error"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(config.table as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [config.table] });
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e.message ?? "Error"),
  });

  const openAdd = () => {
    const init: Record<string, any> = {};
    config.fields.forEach((f) => (init[f.name] = f.defaultValue ?? ""));
    setForm(init);
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (row: any) => {
    const init: Record<string, any> = {};
    config.fields.forEach((f) => (init[f.name] = row[f.name] ?? ""));
    setForm(init);
    setEditing(row);
    setOpen(true);
  };

  const filtered = rows.filter((r: any) => {
    if (!search) return true;
    const cols = config.searchableColumns ?? config.fields.map((f) => f.name);
    return cols.some((c) => String(r[c] ?? "").toLowerCase().includes(search.toLowerCase()));
  });

  const visibleFields = config.fields.filter((f) => !f.hideInTable);

  return (
    <div>
      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 me-2" /> {t("add")}
          </Button>
        }
      />
      <Card className="p-4 shadow-[var(--shadow-card)]">
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9"
          />
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleFields.map((f) => (
                  <TableHead key={f.name}>{f.label}</TableHead>
                ))}
                <TableHead className="text-end">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={visibleFields.length + 1} className="text-center text-muted-foreground py-8">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleFields.length + 1} className="text-center text-muted-foreground py-8">
                    {t("noData")}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row: any) => {
                  const display = config.rowFormatter ? config.rowFormatter(row) : row;
                  return (
                    <TableRow key={row.id}>
                      {visibleFields.map((f) => (
                        <TableCell key={f.name}>
                          {f.formatter ? f.formatter(row[f.name], row) : display[f.name] ?? "—"}
                        </TableCell>
                      ))}
                      <TableCell className="text-end">
                        <div className="flex justify-end gap-1">
                          {config.extraActions?.(row)}
                          <Button size="icon" variant="ghost" onClick={() => openEdit(row)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (confirm(t("confirmDelete"))) remove.mutate(row.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? t("edit") : t("add")} — {config.title}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate(form);
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {config.fields.map((f) => (
              <div key={f.name} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                <Label className="mb-1.5 block">{f.label}{f.required && " *"}</Label>
                {f.type === "select" ? (
                  <Select
                    value={form[f.name] ?? ""}
                    onValueChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))}
                  >
                    <SelectTrigger><SelectValue placeholder={f.placeholder} /></SelectTrigger>
                    <SelectContent>
                      {(f.options ?? []).map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : f.type === "textarea" ? (
                  <Textarea
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                    required={f.required}
                    placeholder={f.placeholder}
                  />
                ) : (
                  <Input
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "email" ? "email" : "text"}
                    step={f.type === "number" ? "0.01" : undefined}
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                    required={f.required}
                    placeholder={f.placeholder}
                  />
                )}
              </div>
            ))}
            <DialogFooter className="md:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
              <Button type="submit" disabled={save.isPending}>{t("save")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Hook to load FK options
export function useFkOptions(table: string, label = "name", value = "id") {
  return useQuery({
    queryKey: [table, "fk", label],
    queryFn: async () => {
      const { data, error } = await supabase.from(table as any).select(`${value}, ${label}`).order(label);
      if (error) throw error;
      return (data ?? []).map((r: any) => ({ value: r[value], label: r[label] }));
    },
  });
}