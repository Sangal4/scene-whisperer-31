import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Boxes,
  Clapperboard,
  Film,
  Home,
  Image as ImageIcon,
  LayoutGrid,
  LogOut,
  Mic,
  Settings,
  Shield,
  Sparkle,
  User,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/_studio")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/" });
  },
  component: StudioLayout,
});

const navMain = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/projects", label: "Projects", icon: LayoutGrid },
  { to: "/episodes", label: "Episodes", icon: Film },
] as const;

const navLibrary = [
  { to: "/library", label: "Characters", icon: User, search: { tab: "characters" } },
  { to: "/library", label: "Backgrounds", icon: ImageIcon, search: { tab: "backgrounds" } },
  { to: "/library", label: "Props", icon: Boxes, search: { tab: "props" } },
  { to: "/library", label: "Audio & Voices", icon: Mic, search: { tab: "voices" } },
] as const;

const navBottom = [
  { to: "/templates", label: "Templates", icon: Sparkle },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function StudioLayout() {
  const { displayName, initials, profile, user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    navigate({ to: "/", replace: true });
  };

  const itemClass =
    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground";
  const activeClass = "bg-sidebar-accent text-foreground";

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="grid size-8 place-items-center rounded-lg border border-border bg-elevated">
            <Clapperboard className="size-4 text-primary" />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight">Studio</span>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
          <div className="space-y-0.5">
            {navMain.map(({ to, label, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className={itemClass}
                activeProps={{ className: `${itemClass} ${activeClass}` }}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </div>

          <div>
            <p className="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">
              Library
            </p>
            <div className="space-y-0.5">
              {navLibrary.map(({ to, label, icon: Icon, search }) => (
                <Link key={label} to={to} search={search} className={itemClass}>
                  <Icon className="size-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-0.5">
            {navBottom.map(({ to, label, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className={itemClass}
                activeProps={{ className: `${itemClass} ${activeClass}` }}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-sidebar-accent">
              <span className="grid size-8 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                {user.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{user.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                <Settings className="size-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
