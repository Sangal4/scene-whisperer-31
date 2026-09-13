import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Shield, ShieldOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_studio/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Studio" },
      { name: "description", content: "Manage Studio members and their access levels." },
      { property: "og:title", content: "Admin — Studio" },
      { property: "og:description", content: "Manage Studio members and their access levels." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

type Member = {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  roles: string[];
};

function AdminPage() {
  const { isAdmin, loading } = useAuth();

  const members = useQuery({
    queryKey: ["admin", "members"],
    enabled: isAdmin,
    queryFn: async (): Promise<Member[]> => {
      const [{ data: profiles, error }, { data: roles }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, email, display_name, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (error) throw error;
      const byUser = new Map<string, string[]>();
      for (const r of (roles ?? []) as { user_id: string; role: string }[]) {
        byUser.set(r.user_id, [...(byUser.get(r.user_id) ?? []), r.role]);
      }
      return ((profiles ?? []) as Omit<Member, "roles">[]).map((p) => ({
        ...p,
        roles: byUser.get(p.id) ?? [],
      }));
    },
  });

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <ShieldOff className="mx-auto size-8 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl tracking-tight">Admins only</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account doesn't have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10">
      <header className="mb-8">
        <h1 className="flex items-center gap-2 font-display text-2xl tracking-tight">
          <Shield className="size-5 text-primary" /> Members
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Everyone with a Studio account and the access level they hold.
        </p>
      </header>

      <div className="panel divide-y divide-border">
        {members.isLoading ? (
          <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading members…
          </div>
        ) : members.data && members.data.length > 0 ? (
          members.data.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm">{m.display_name ?? "Unnamed creator"}</p>
                <p className="truncate text-xs text-muted-foreground">{m.email}</p>
              </div>
              <div className="flex flex-wrap justify-end gap-1.5">
                {(m.roles.length > 0 ? m.roles : ["creator"]).map((role) => (
                  <span
                    key={role}
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-wide text-muted-foreground"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="p-6 text-sm text-muted-foreground">No members yet.</p>
        )}
      </div>
    </div>
  );
}
