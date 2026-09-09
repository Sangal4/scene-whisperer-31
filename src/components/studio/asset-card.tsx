import { AudioLines, Boxes, Image as ImageIcon, Mic, User } from "lucide-react";
import type { Asset, AssetKind } from "@/lib/studio-data";
import { cn } from "@/lib/utils";

export const kindIcon: Record<AssetKind, React.ComponentType<{ className?: string }>> = {
  character: User,
  background: ImageIcon,
  prop: Boxes,
  voice: Mic,
  audio: AudioLines,
};

export const kindLabel: Record<AssetKind, string> = {
  character: "Character",
  background: "Background",
  prop: "Prop",
  voice: "Voice",
  audio: "Audio",
};

export function AssetThumb({
  asset,
  className,
  rounded = "rounded-lg",
}: {
  asset: Asset;
  className?: string;
  rounded?: string;
}) {
  const Icon = kindIcon[asset.kind];
  if (asset.image) {
    return (
      <img
        src={asset.image}
        alt={asset.name}
        loading="lazy"
        className={cn("object-cover", rounded, className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-elevated text-muted-foreground",
        rounded,
        className,
      )}
    >
      <Icon className="size-1/3" />
    </div>
  );
}

export function AssetCard({ asset, onClick }: { asset: Asset; onClick?: () => void }) {
  const Icon = kindIcon[asset.kind];
  return (
    <button
      type="button"
      onClick={onClick}
      className="group panel overflow-hidden text-left transition-all hover:border-border-strong hover:shadow-lift focus-visible:outline-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-elevated">
        <AssetThumb
          asset={asset}
          rounded="rounded-none"
          className="size-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-2 py-1 text-[11px] backdrop-blur-sm">
          <Icon className="size-3" />
          {kindLabel[asset.kind]}
        </span>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">{asset.name}</p>
            <p className="text-xs text-muted-foreground">
              {asset.role} · {asset.style}
            </p>
          </div>
          <span className="shrink-0 text-[11px] text-muted-foreground">{asset.uses} uses</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {asset.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-border bg-elevated px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
