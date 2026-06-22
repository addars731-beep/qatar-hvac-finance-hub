import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  tone?: "default" | "success" | "warning" | "destructive";
}) {
  const toneClass = {
    default: "text-primary bg-primary/10",
    success: "text-[oklch(0.62_0.15_155)] bg-[oklch(0.62_0.15_155/0.12)]",
    warning: "text-[oklch(0.72_0.16_75)] bg-[oklch(0.72_0.16_75/0.15)]",
    destructive: "text-destructive bg-destructive/10",
  }[tone];

  return (
    <Card className="p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{label}</div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
        </div>
        <div className={`p-2.5 rounded-lg ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}