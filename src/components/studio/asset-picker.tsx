import { Check } from "lucide-react";
import { assets, type AssetKind } from "@/lib/studio-data";
import { AssetThumb, kindLabel } from "@/components/studio/asset-card";
import { cn } from "@/lib/utils";

const groups: AssetKind[] = ["character", "background", "prop", "voice", "audio"];

export function AssetPicker({
  selected,
  onToggle,
  kinds = groups,
}: {
  selected: string[];
  onToggle: (id: string) => void;
  kinds?: AssetKind[];
}) {
  return (
    <div className="space-y-6">
      {kinds.map((kind) => (
        <div key={kind}>
          <p className="mb-2.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Choose {kindLabel[kind]}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {assets
              .filter((a) => a.kind === kind)
              .map((a) => {
                const on = selected.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onToggle(a.id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border p-2 text-left transition-colors",
                      on
                        ? "border-primary/50 bg-primary/10"
                        : "border-border bg-elevated hover:border-border-strong",
                    )}
                  >
                    <AssetThumb asset={a} className="size-10 shrink-0" rounded="rounded-md" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{a.name}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {a.role}
                      </span>
                    </span>
                    {on ? <Check className="size-4 shrink-0 text-primary" /> : null}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
