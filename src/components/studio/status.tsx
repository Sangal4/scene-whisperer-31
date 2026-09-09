import { cn } from "@/lib/utils";
import type { EpisodeStatus, SceneStatus } from "@/lib/studio-data";

const sceneTone: Record<SceneStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  generating: "bg-info/15 text-info border-info/30",
  ready: "bg-success/15 text-success border-success/30",
  review: "bg-warning/15 text-warning border-warning/30",
  failed: "bg-destructive/15 text-destructive border-destructive/30",
};

const sceneText: Record<SceneStatus, string> = {
  draft: "Draft",
  generating: "Generating",
  ready: "Ready",
  review: "Needs Review",
  failed: "Failed",
};

const episodeTone: Record<EpisodeStatus, string> = {
  complete: "bg-success/15 text-success border-success/30",
  "in-progress": "bg-info/15 text-info border-info/30",
  draft: "bg-muted text-muted-foreground border-border",
};

const episodeText: Record<EpisodeStatus, string> = {
  complete: "Complete",
  "in-progress": "In Progress",
  draft: "Draft",
};

export function StatusPill({
  status,
  kind = "scene",
  className,
}: {
  status: SceneStatus | EpisodeStatus;
  kind?: "scene" | "episode";
  className?: string;
}) {
  const isScene = kind === "scene";
  const tone = isScene
    ? sceneTone[status as SceneStatus]
    : episodeTone[status as EpisodeStatus];
  const label = isScene
    ? sceneText[status as SceneStatus]
    : episodeText[status as EpisodeStatus];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        tone,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function SectionHeading({
  title,
  action,
  subtitle,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
