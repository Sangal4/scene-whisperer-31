import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  Activity,
  ArrowUp,
  Check,
  Circle,
  Download,
  Loader2,
  Maximize2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StatusPill } from "@/components/studio/status";
import { AssetThumb, kindLabel } from "@/components/studio/asset-card";
import { AssetPicker } from "@/components/studio/asset-picker";
import { assetById, promptSuggestions, images } from "@/lib/studio-data";
import { useStudio, type AgentStep } from "@/lib/studio-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_studio/scenes/$sceneId")({
  head: () => ({
    meta: [
      { title: "Scene Workspace — Studio" },
      {
        name: "description",
        content: "Direct your AI Animation Director: describe the scene and watch it get built.",
      },
      { property: "og:title", content: "Scene Workspace — Studio" },
      {
        property: "og:description",
        content: "Direct your AI Animation Director: describe the scene and watch it get built.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SceneWorkspace,
});

function SceneWorkspace() {
  const { sceneId } = useParams({ from: "/_studio/scenes/$sceneId" });
  const { scenes, episodes, projects, runtimeFor, removeSceneAsset, toggleSceneAsset } =
    useStudio();
  const navigate = useNavigate();

  const scene = scenes.find((s) => s.id === sceneId);
  const episode = episodes.find((e) => e.id === scene?.episodeId);
  const project = projects.find((p) => p.id === episode?.projectId);
  const siblings = scenes.filter((s) => s.episodeId === scene?.episodeId);
  const runtime = runtimeFor(sceneId);

  if (!scene || !episode) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-xl">Scene not found</h1>
        <Link to="/episodes" className="mt-4 inline-block text-sm text-primary">
          Back to episodes
        </Link>
      </div>
    );
  }

  const assets = scene.assetIds.map((id) => assetById(id)).filter(Boolean);
  const byKind = (kind: string) => assets.filter((a) => a!.kind === kind);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <nav className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          {project ? (
            <Link
              to="/projects/$projectId"
              params={{ projectId: project.id }}
              className="truncate transition-colors hover:text-foreground"
            >
              {project.name}
            </Link>
          ) : null}
          <span>/</span>
          <Link
            to="/episodes/$episodeId"
            params={{ episodeId: episode.id }}
            className="truncate transition-colors hover:text-foreground"
          >
            Episode {String(episode.number).padStart(2, "0")}
          </Link>
          <span>/</span>
          <span className="truncate text-foreground">{episode.title}</span>
        </nav>
        <div className="flex items-center gap-2">
          <AgentActivitySheet sceneId={sceneId} />
          <Button variant="outline" size="sm" onClick={() => toast("Export queued")}>
            <Download className="size-4" /> Export
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[224px_minmax(0,1fr)_380px]">
        {/* LEFT: scene list */}
        <aside className="hidden min-h-0 flex-col border-r border-border bg-sidebar lg:flex">
          <div className="border-b border-border px-4 py-3">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Episode {String(episode.number).padStart(2, "0")}
            </p>
            <p className="mt-0.5 truncate text-sm font-medium">{episode.title}</p>
          </div>
          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-1 p-2">
              {siblings.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => navigate({ to: "/scenes/$sceneId", params: { sceneId: s.id } })}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors",
                    s.id === sceneId ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60",
                  )}
                >
                  <img
                    src={s.thumb}
                    alt=""
                    loading="lazy"
                    className="aspect-video w-14 shrink-0 rounded-md object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[10px] text-muted-foreground">
                      {String(s.number).padStart(2, "0")}
                    </span>
                    <span className="block truncate text-xs">{s.title}</span>
                  </span>
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      s.status === "ready"
                        ? "bg-success"
                        : s.status === "generating"
                          ? "bg-info animate-pulse-dot"
                          : s.status === "review"
                            ? "bg-warning"
                            : "bg-muted-foreground/50",
                    )}
                  />
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* CENTER */}
        <main className="flex min-h-0 flex-col overflow-y-auto">
          <SceneViewer sceneId={sceneId} />

          {/* Scene assets */}
          <section className="border-t border-border px-6 py-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium">Scene Assets</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="size-4" /> Add Asset
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add assets from your library</DialogTitle>
                    <DialogDescription>
                      Anything you attach here becomes available to the Animation Director.
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-96 rounded-xl border border-border bg-elevated p-4">
                    <AssetPicker
                      selected={scene.assetIds}
                      onToggle={(id) => toggleSceneAsset(sceneId, id)}
                    />
                  </ScrollArea>
                  <DialogFooter>
                    <p className="text-xs text-muted-foreground">
                      {scene.assetIds.length} assets attached to this scene.
                    </p>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-wrap gap-6">
              {(["character", "background", "prop", "voice", "audio"] as const).map((kind) => {
                const items = byKind(kind);
                if (items.length === 0) return null;
                return (
                  <div key={kind}>
                    <p className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                      {kindLabel[kind]}
                      {items.length > 1 ? "s" : ""}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {items.map((a) => (
                        <span
                          key={a!.id}
                          className="group flex items-center gap-2 rounded-lg border border-border bg-elevated py-1.5 pl-1.5 pr-2.5"
                        >
                          <AssetThumb asset={a!} className="size-8" rounded="rounded-md" />
                          <span className="text-xs">{a!.name}</span>
                          <button
                            type="button"
                            aria-label={`Remove ${a!.name}`}
                            onClick={() => removeSceneAsset(sceneId, a!.id)}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <X className="size-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <Timeline duration={scene.duration} />
        </main>

        {/* RIGHT: agent */}
        <AgentPanel sceneId={sceneId} />
      </div>

      {/* Generation overlay state banner */}
      {runtime.phase === "generating" ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-4 lg:hidden">
          <div className="panel flex items-center gap-3 px-4 py-2 text-xs">
            <Loader2 className="size-4 animate-spin text-primary" />
            {runtime.stageLabel}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ---------------- viewer ---------------- */

function SceneViewer({ sceneId }: { sceneId: string }) {
  const { scenes, runtimeFor, regenerate } = useStudio();
  const scene = scenes.find((s) => s.id === sceneId)!;
  const runtime = runtimeFor(sceneId);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(35);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setPos((p) => (p >= 100 ? 0 : p + 1)), 80);
    return () => clearInterval(t);
  }, [playing]);

  const generating = runtime.phase === "generating";

  return (
    <section className="px-6 pb-5 pt-5">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-muted-foreground">
            Scene {String(scene.number).padStart(2, "0")}
          </p>
          <h1 className="mt-0.5 font-display text-lg tracking-tight">{scene.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill status={scene.status} />
          <Button variant="outline" size="sm" onClick={() => regenerate(sceneId)}>
            <Sparkles className="size-4" /> Generate
          </Button>
        </div>
      </div>

      <div className="panel relative overflow-hidden">
        <div className="relative aspect-video bg-elevated">
          <img
            src={scene.thumb || images.sceneClassroom}
            alt={`${scene.title} preview`}
            className={cn(
              "size-full object-cover transition-all duration-500",
              generating && "scale-105 opacity-30 blur-sm",
            )}
          />

          {generating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
              <Loader2 className="size-6 animate-spin text-primary" />
              <div>
                <p className="font-display text-base">Agent is building your scene…</p>
                <p className="mt-1 text-xs text-muted-foreground">{runtime.stageLabel}</p>
              </div>
              <div className="w-full max-w-sm">
                <Progress value={runtime.progress} className="h-1" />
                <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                  {["Scene planning", "Asset loading", "Animation", "Camera", "Rendering"].map(
                    (s, i) => (
                      <span
                        key={s}
                        className={cn(runtime.progress >= (i + 1) * 18 && "text-primary")}
                      >
                        {s}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {runtime.phase === "failed" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80">
              <p className="font-display">Something went wrong</p>
              <Button size="sm" onClick={() => regenerate(sceneId)}>
                <RotateCcw className="size-4" /> Try Again
              </Button>
            </div>
          ) : null}
        </div>

        {/* viewer controls */}
        <div className="flex items-center gap-3 border-t border-border px-4 py-2.5">
          <button
            type="button"
            aria-label="Rewind"
            onClick={() => setPos(0)}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-4" />
          </button>
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => setPlaying((p) => !p)}
            className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <span className="font-mono text-[11px] text-muted-foreground">
            {((pos / 100) * 8.4).toFixed(1)}s / {scene.duration}
          </span>
          <Slider
            value={[pos]}
            onValueChange={([v]) => setPos(v)}
            max={100}
            step={1}
            className="mx-2 flex-1"
          />
          <button
            type="button"
            aria-label="Fullscreen"
            onClick={() => toast("Fullscreen preview is simulated")}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
      </div>

      <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-2 text-xs">
        {[
          ["Camera", scene.camera],
          ["Duration", scene.duration],
          ["Resolution", "1920 × 1080"],
          ["FPS", "24"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="mt-0.5">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------------- timeline ---------------- */

const tracks: { name: string; blocks: { label: string; start: number; width: number }[] }[] = [
  {
    name: "Maya",
    blocks: [
      { label: "Walk", start: 0, width: 34 },
      { label: "Stop", start: 36, width: 16 },
      { label: "Pick Up", start: 54, width: 30 },
    ],
  },
  {
    name: "Student 1",
    blocks: [
      { label: "Idle", start: 0, width: 52 },
      { label: "Look", start: 54, width: 34 },
    ],
  },
  { name: "Device", blocks: [{ label: "On desk", start: 0, width: 54 }, { label: "Held", start: 56, width: 40 }] },
  {
    name: "Camera",
    blocks: [
      { label: "Medium", start: 0, width: 58 },
      { label: "Close", start: 60, width: 38 },
    ],
  },
  { name: "Audio", blocks: [{ label: "Dialogue", start: 20, width: 62 }] },
];

function Timeline({ duration }: { duration: string }) {
  return (
    <section className="border-t border-border px-6 py-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium">Timeline</p>
        <p className="font-mono text-[11px] text-muted-foreground">{duration}</p>
      </div>

      <div className="panel p-4">
        <div className="mb-3 flex items-center gap-3 pl-24 font-mono text-[10px] text-muted-foreground">
          {["00:00", "02s", "04s", "06s", "08s"].map((t) => (
            <span key={t} className="flex-1 first:flex-none">
              {t}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          {tracks.map((track) => (
            <div key={track.name} className="flex items-center gap-3">
              <span className="w-20 shrink-0 truncate text-xs text-muted-foreground">
                {track.name}
              </span>
              <div className="relative h-7 flex-1 rounded-md bg-elevated">
                {track.blocks.map((b) => (
                  <span
                    key={b.label}
                    style={{ left: `${b.start}%`, width: `${b.width}%` }}
                    className="absolute inset-y-1 flex items-center overflow-hidden rounded-sm border border-primary/25 bg-primary/15 px-2 text-[10px] text-primary"
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- agent activity ---------------- */

function AgentActivitySheet({ sceneId }: { sceneId: string }) {
  const { runtimeFor } = useStudio();
  const runtime = runtimeFor(sceneId);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Activity className="size-4" /> Agent Activity
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Agent Activity</SheetTitle>
          <SheetDescription className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-success animate-pulse-dot" />
            Connected to Blender
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-260px)] px-4">
          <ol className="space-y-3 border-l border-border pl-4">
            {runtime.activity.map((a, i) => (
              <li key={`${a.time}-${i}`} className="relative text-xs">
                <span className="absolute -left-[21px] top-1.5 size-1.5 rounded-full bg-primary/70" />
                <span className="font-mono text-muted-foreground">{a.time}</span>
                <p className="mt-0.5">{a.text}</p>
              </li>
            ))}
          </ol>
        </ScrollArea>

        <div className="border-t border-border p-4">
          <p className="mb-2 text-xs text-muted-foreground">
            {runtime.phase === "generating" ? "Rendering scene preview…" : runtime.stageLabel}
          </p>
          <Progress value={runtime.progress} className="h-1" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ---------------- agent panel ---------------- */

function StepRow({ step }: { step: AgentStep }) {
  return (
    <li className="flex items-center gap-2 text-xs">
      {step.state === "done" ? (
        <Check className="size-3.5 text-success" />
      ) : step.state === "active" ? (
        <Loader2 className="size-3.5 animate-spin text-primary" />
      ) : (
        <Circle className="size-3.5 text-muted-foreground/40" />
      )}
      <span
        className={cn(
          step.state === "pending" && "text-muted-foreground/60",
          step.state === "active" && "text-foreground",
          step.state === "done" && "text-muted-foreground",
        )}
      >
        {step.label}
      </span>
    </li>
  );
}

function AgentPanel({ sceneId }: { sceneId: string }) {
  const { runtimeFor, sendInstruction, updateScene } = useStudio();
  const runtime = runtimeFor(sceneId);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [runtime.messages.length, runtime.progress]);

  const send = (value?: string) => {
    const message = (value ?? text).trim();
    if (!message) return;
    sendInstruction(sceneId, message);
    setText("");
  };

  return (
    <aside className="flex min-h-0 flex-col border-t border-border bg-sidebar lg:border-l lg:border-t-0">
      <header className="shrink-0 border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="font-display text-sm font-semibold tracking-tight">Animation Director</p>
          <span className="flex items-center gap-1.5 text-[11px] text-success">
            <span className="size-1.5 rounded-full bg-success animate-pulse-dot" /> Online
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Describe what should happen. I'll build the scene.
        </p>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-5 p-5">
          {runtime.messages.map((m) => (
            <div key={m.id} className="animate-rise-in space-y-2.5">
              {m.role === "user" ? (
                <div className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                    {m.text}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  {m.steps ? (
                    <ul className="space-y-1.5 rounded-xl border border-border bg-elevated p-3">
                      {m.steps.map((s) => (
                        <StepRow key={s.label} step={s} />
                      ))}
                    </ul>
                  ) : null}
                  {m.preview ? (
                    <div className="overflow-hidden rounded-xl border border-border">
                      <img
                        src={m.preview}
                        alt="Rendered preview"
                        loading="lazy"
                        className="aspect-video w-full object-cover"
                      />
                      <p className="border-t border-border bg-elevated px-3 py-1.5 text-[11px] text-muted-foreground">
                        Preview ready
                      </p>
                    </div>
                  ) : null}
                  {m.actions ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast("Playing preview")}
                      >
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          updateScene(sceneId, { status: "ready" });
                          toast.success("Changes applied to the scene");
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      <div className="shrink-0 space-y-3 border-t border-border p-4">
        <div className="flex flex-wrap gap-1.5">
          {promptSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-full border border-border bg-elevated px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="Describe what should happen..."
            className="resize-none pr-12"
          />
          <Button
            size="icon"
            aria-label="Send instruction"
            onClick={() => send()}
            className="absolute bottom-2 right-2 size-8"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
