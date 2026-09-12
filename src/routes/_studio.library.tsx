import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Filter, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AssetCard } from "@/components/studio/asset-card";
import { assets, type AssetKind } from "@/lib/studio-data";
import { cn } from "@/lib/utils";

type Tab = "all" | "characters" | "backgrounds" | "props" | "audio" | "voices";

const tabs: { id: Tab; label: string; kind?: AssetKind }[] = [
  { id: "all", label: "All" },
  { id: "characters", label: "Characters", kind: "character" },
  { id: "backgrounds", label: "Backgrounds", kind: "background" },
  { id: "props", label: "Props", kind: "prop" },
  { id: "audio", label: "Audio", kind: "audio" },
  { id: "voices", label: "Voices", kind: "voice" },
];

export const Route = createFileRoute("/_studio/library")({
  validateSearch: (search: Record<string, unknown>): { tab?: Tab } => {
    const tab = search["tab"] as Tab | undefined;
    return tab && tabs.some((t) => t.id === tab) ? { tab } : {};
  },
  head: () => ({
    meta: [
      { title: "Asset Library — Studio" },
      { name: "description", content: "Everything your AI can use inside your stories." },
      { property: "og:title", content: "Asset Library — Studio" },
      { property: "og:description", content: "Everything your AI can use inside your stories." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { tab: searchTab } = Route.useSearch();
  const navigate = useNavigate({ from: "/library" });
  const [query, setQuery] = useState("");
  const active: Tab = searchTab ?? "all";

  const visible = useMemo(() => {
    const kind = tabs.find((t) => t.id === active)?.kind;
    return assets.filter(
      (a) =>
        (!kind || a.kind === kind) &&
        (query.trim() === "" ||
          `${a.name} ${a.role} ${a.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())),
    );
  }, [active, query]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-tight">Asset Library</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Everything your AI can use inside your stories.
          </p>
        </div>
        <Button onClick={() => toast("Asset importer is simulated in this prototype")}>
          <Plus className="size-4" /> Add Asset
        </Button>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-elevated p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate({ search: t.id === "all" ? {} : { tab: t.id } })}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm transition-colors",
                active === t.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assets..."
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={() => toast("Filters coming soon")}>
          <Filter className="size-4" /> Filter
        </Button>
      </div>

      {visible.length === 0 ? (
        <div className="panel p-16 text-center">
          <p className="text-sm text-muted-foreground">No assets match “{query}”.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((a) => (
            <AssetCard key={a.id} asset={a} onClick={() => toast(`${a.name} · ${a.uses} uses`)} />
          ))}
        </div>
      )}
    </div>
  );
}
