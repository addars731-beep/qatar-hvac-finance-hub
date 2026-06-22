import { Link, useRouterState, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Receipt,
  FileText,
  CreditCard,
  Truck,
  UserCog,
  CalendarCheck,
  Wallet,
  Package,
  ShoppingCart,
  FolderOpen,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function NavItem({
  to,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function AppShell() {
  const { t, lang, setLang } = useI18n();
  const { user, signOut, hasRole } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const items = [
    { to: "/", icon: LayoutDashboard, label: t("dashboard") },
    { to: "/clients", icon: Users, label: t("clients") },
    { to: "/projects", icon: Briefcase, label: t("projects") },
    { to: "/expenses", icon: Receipt, label: t("expenses") },
    { to: "/invoices", icon: FileText, label: t("invoices") },
    { to: "/payments", icon: CreditCard, label: t("payments") },
    { to: "/vendors", icon: Truck, label: t("vendors") },
    { to: "/employees", icon: UserCog, label: t("employees") },
    { to: "/attendance", icon: CalendarCheck, label: t("attendance") },
    { to: "/payroll", icon: Wallet, label: t("payroll") },
    { to: "/inventory", icon: Package, label: t("inventory") },
    { to: "/purchase-orders", icon: ShoppingCart, label: t("purchaseOrders") },
    { to: "/documents", icon: FolderOpen, label: t("documents") },
    { to: "/reports", icon: BarChart3, label: t("reports") },
  ];
  if (hasRole("admin")) items.push({ to: "/users", icon: Shield, label: t("users") });
  items.push({ to: "/settings", icon: Settings, label: t("settings") });

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  const Sidebar = (
    <aside className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground border-e border-sidebar-border">
      <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
        <div>
          <div className="text-base font-bold text-sidebar-primary-foreground">{t("appName")}</div>
          <div className="text-xs text-sidebar-foreground/60">{t("appTagline")}</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {items.map((i) => (
          <NavItem
            key={i.to}
            to={i.to}
            icon={i.icon}
            label={i.label}
            active={isActive(i.to)}
            onClick={() => setOpen(false)}
          />
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3 space-y-2">
        <div className="text-xs text-sidebar-foreground/60 truncate px-1">{user?.email}</div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 me-2" />
          {t("signOut")}
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{Sidebar}</div>
      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 start-0">{Sidebar}</div>
        </div>
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
            >
              <Globe className="h-4 w-4 me-2" />
              {lang === "en" ? "العربية" : "English"}
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}