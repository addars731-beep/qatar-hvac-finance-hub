import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

const ROLES = ["admin","finance_manager","accountant","project_manager","site_engineer","store_keeper","hr","viewer"] as const;

export const Route = createFileRoute("/_authenticated/users")({
  component: UsersPage,
});

function UsersPage() {
  const { t } = useI18n();
  const { hasRole } = useAuth();
  const qc = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ["users", "list"],
    queryFn: async () => {
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email, designation"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      return (profiles ?? []).map((p: any) => ({
        ...p,
        roles: (roles ?? []).filter((r: any) => r.user_id === p.id).map((r: any) => r.role),
      }));
    },
  });

  const [adding, setAdding] = useState<Record<string, string>>({});

  const grant = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: role as any });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); toast.success("Role granted"); },
    onError: (e: any) => toast.error(e.message),
  });
  const revoke = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as any);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); toast.success("Role revoked"); },
    onError: (e: any) => toast.error(e.message),
  });

  if (!hasRole("admin")) {
    return (
      <div>
        <PageHeader title={t("users")} />
        <Card className="p-8 text-center text-muted-foreground">Admin access required.</Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={t("users")} description="Grant or revoke roles. Users sign up at /auth." />
      <Card className="p-4 shadow-[var(--shadow-card)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Grant role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u: any) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.full_name ?? "—"}</TableCell>
                <TableCell>{u.email ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {u.roles.length === 0 ? <span className="text-xs text-muted-foreground">no roles</span> :
                      u.roles.map((r: string) => (
                        <Badge key={r} variant="secondary" className="cursor-pointer" onClick={() => revoke.mutate({ userId: u.id, role: r })}>
                          {r} ✕
                        </Badge>
                      ))
                    }
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Select value={adding[u.id] ?? ""} onValueChange={(v) => setAdding((s) => ({ ...s, [u.id]: v }))}>
                      <SelectTrigger className="w-44"><SelectValue placeholder="Select role" /></SelectTrigger>
                      <SelectContent>
                        {ROLES.filter(r => !u.roles.includes(r)).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => { if (adding[u.id]) grant.mutate({ userId: u.id, role: adding[u.id] }); }}>Grant</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}