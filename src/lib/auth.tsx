import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Role =
  | "admin"
  | "finance_manager"
  | "accountant"
  | "project_manager"
  | "site_engineer"
  | "store_keeper"
  | "hr"
  | "viewer";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: Role[];
  hasRole: (r: Role | Role[]) => boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => {
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", s.user.id)
            .then(({ data }) => {
              setRoles((data ?? []).map((r) => r.role as Role));
            });
        }, 0);
      } else {
        setRoles([]);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.session.user.id)
          .then(({ data: rs }) => {
            setRoles((rs ?? []).map((r) => r.role as Role));
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const hasRole = (r: Role | Role[]) => {
    if (roles.includes("admin")) return true;
    const list = Array.isArray(r) ? r : [r];
    return list.some((x) => roles.includes(x));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <Ctx.Provider value={{ user, session, loading, roles, hasRole, signOut }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}