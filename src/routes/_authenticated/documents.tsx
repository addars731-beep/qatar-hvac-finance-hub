import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { useFkOptions } from "@/components/crud-page";

export const Route = createFileRoute("/_authenticated/documents")({
  component: DocumentsPage,
});

function DocumentsPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("contract");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [vendorId, setVendorId] = useState<string | null>(null);

  const projects = useFkOptions("projects", "name");
  const clients = useFkOptions("clients", "name");
  const vendors = useFkOptions("vendors", "name");

  const { data: docs = [] } = useQuery({
    queryKey: ["documents", "list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*, projects(name), clients(name), vendors(name)")
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const upload = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Select a file");
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("documents").upload(path, file);
      if (upErr) throw upErr;
      const { data: signed } = await supabase.storage.from("documents").createSignedUrl(path, 60 * 60 * 24 * 365);
      const { error } = await supabase.from("documents").insert({
        name: name || file.name,
        file_url: signed?.signedUrl ?? path,
        file_type: file.type,
        category,
        project_id: projectId || null,
        client_id: clientId || null,
        vendor_id: vendorId || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Uploaded");
      setOpen(false);
      setFile(null); setName(""); setProjectId(null); setClientId(null); setVendorId(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("documents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Deleted");
    },
  });

  return (
    <div>
      <PageHeader
        title={t("documents")}
        description="Contracts, quotations, receipts, drawings — organized by client, project, vendor."
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 me-2" /> Upload</Button>}
      />
      <Card className="p-4 shadow-[var(--shadow-card)]">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("client")}</TableHead>
                <TableHead>{t("project")}</TableHead>
                <TableHead>{t("vendor")}</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-end">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{t("noData")}</TableCell></TableRow>
              ) : docs.map((d: any) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" />{d.name}</TableCell>
                  <TableCell>{d.category}</TableCell>
                  <TableCell>{d.clients?.name ?? "—"}</TableCell>
                  <TableCell>{d.projects?.name ?? "—"}</TableCell>
                  <TableCell>{d.vendors?.name ?? "—"}</TableCell>
                  <TableCell>{formatDate(d.uploaded_at)}</TableCell>
                  <TableCell className="text-end">
                    <a href={d.file_url} target="_blank" rel="noreferrer">
                      <Button size="icon" variant="ghost"><Download className="h-4 w-4" /></Button>
                    </a>
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm(t("confirmDelete"))) remove.mutate(d.id); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>File *</Label>
              <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <div>
              <Label>Display Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional, defaults to filename" />
            </div>
            <div>
              <Label>{t("category")}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["contract","quotation","invoice","receipt","drawing","purchase_order","other"].map(c => (
                    <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>{t("client")}</Label>
                <Select value={clientId ?? ""} onValueChange={(v) => setClientId(v || null)}>
                  <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>{(clients.data ?? []).map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("project")}</Label>
                <Select value={projectId ?? ""} onValueChange={(v) => setProjectId(v || null)}>
                  <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>{(projects.data ?? []).map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("vendor")}</Label>
                <Select value={vendorId ?? ""} onValueChange={(v) => setVendorId(v || null)}>
                  <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>{(vendors.data ?? []).map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
            <Button onClick={() => upload.mutate()} disabled={!file || upload.isPending}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}