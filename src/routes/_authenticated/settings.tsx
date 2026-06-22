import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const { user, roles } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) { setFullName(data.full_name ?? ""); setPhone(data.phone ?? ""); setDesignation(data.designation ?? ""); }
    });
  }, [user]);

  const save = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ full_name: fullName, phone, designation }).eq("id", user.id);
    if (error) toast.error(error.message); else toast.success("Saved");
  };

  return (
    <div>
      <PageHeader title={t("settings")} description="Profile and preferences." />
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5 shadow-[var(--shadow-card)] space-y-4">
          <h3 className="font-semibold">Profile</h3>
          <div><Label>{t("email")}</Label><Input value={user?.email ?? ""} disabled /></div>
          <div><Label>{t("fullName")}</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
          <div><Label>{t("mobile")}</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div><Label>{t("designation")}</Label><Input value={designation} onChange={(e) => setDesignation(e.target.value)} /></div>
          <Button onClick={save}>{t("save")}</Button>
        </Card>
        <Card className="p-5 shadow-[var(--shadow-card)] space-y-4">
          <h3 className="font-semibold">Preferences</h3>
          <div>
            <Label>{t("language")}</Label>
            <div className="flex gap-2 mt-1">
              <Button variant={lang === "en" ? "default" : "outline"} size="sm" onClick={() => setLang("en")}>English</Button>
              <Button variant={lang === "ar" ? "default" : "outline"} size="sm" onClick={() => setLang("ar")}>العربية</Button>
            </div>
          </div>
          <div>
            <Label>Your roles</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {roles.length === 0 ? <span className="text-sm text-muted-foreground">No roles assigned</span> : roles.map(r => (
                <span key={r} className="text-xs px-2 py-1 rounded bg-secondary">{r}</span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}