import { useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { Download, Play, Settings2, Sparkles, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SectionHeading, StatusPill } from "@/components/studio/status";
import { AssetPicker } from "@/components/studio/asset-picker";
import { assetById } from "@/lib/studio-data";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/_studio/episodes/$episodeId")({
  head: () => ({
    meta: [
      { title: "Episode — Studio" },
      { name: "description", content: "Scenes, statuses and AI generation progress for this episode." },
      { property: "og:title", content: "Episode — Studio" },
      {
        property: "og:description",
        content: "Scenes, statuses and AI generation progress for this episode.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EpisodePage,
});

function EpisodePage() {
  const { episodeId } = useParams({ from: "/_studio/episodes/$episodeId" });
  const { episodes, projects, scenes, addScene } = useStudio();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [picked, setPicked] = useState<string[]>(["maya", "bg-classroom", "voice-maya"]);

  const episode = episodes.find((e) => e.id === episodeId);
  const project = projects.find((p) => p.id === episode?.projectId);
  const list = scenes.filter((s) => s.episodeId === episodeId);

  if (!episode) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-xl">Episode not found</h1>
        <Link to="/episodes" className="mt-4 inline-block text-sm text-primary">
          Back to episodes
        </Link>
      </div>
    );
  }

  const create = () => {
    const scene = addScene(episode.id, {
      title: name.trim() || summary.slice(0, 40) || "New Scene",
      summary: summary.trim() || "A new scene.",
      assetIds: picked,
    });
    setOpen(false);
    setName("");
    setSummary("");
    toast.success("Agent is building your scene");
    navigate({ to: "/scenes/$sceneId", params: { sceneId: scene.id } });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {project ? (
          <>
            <Link
              to="/projects/$projectId"
              params={{ projectId: project.id }}
              className="transition-colors hover:text-foreground"
            >
              {project.name}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span>Episode {String(episode.number).padStart(2, "0")}</span>
        <span>/</span>
        <span className="text-foreground">{episode.title}</span>
      </nav>

      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl tracking-tight">{episode.title}</h1>
            <StatusPill status={episode.status} kind="episode" />
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {list.length} scenes · {episode.duration} · Edited {episode.edited}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast("Playing episode preview")}>
            <Play className="size-4" /> Preview
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast("Export queued")}>
            <Download className="size-4" /> Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/settings" })}>
            <Settings2 className="size-4" /> Episode Settings
          </Button>
        </div>
      </header>

      <SectionHeading
        title="Scenes"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" /> Add Scene
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Scene</DialogTitle>
                <DialogDescription>
                  Describe what happens. The agent picks the assets and builds it.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-1">
                <div className="space-y-2">
                  <Label htmlFor="scene-name">Scene name</Label>
                  <Input
                    id="scene-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="The Broken Device"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scene-desc">What happens in this scene?</Label>
                  <Textarea
                    id="scene-desc"
                    rows={4}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Maya walks into the classroom, notices the broken device on the desk, picks it up and asks the students what happened."
                  />
                </div>
                <ScrollArea className="h-64 rounded-xl border border-border bg-elevated p-4">
                  <AssetPicker
                    selected={picked}
                    onToggle={(id) =>
                      setPicked((prev) =>
                        prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
                      )
                    }
                  />
                </ScrollArea>
                <p className="text-xs text-muted-foreground">
                  {picked.length} assets selected ·{" "}
                  {picked
                    .map((id) => assetById(id)?.name)
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={create}>
                  <Sparkles className="size-4" /> Create Scene with AI
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((scene) => {
          const characters = scene.assetIds.filter(
            (id) => assetById(id)?.kind === "character",
          ).length;
          return (
            <Link
              key={scene.id}
              to="/scenes/$sceneId"
              params={{ sceneId: scene.id }}
              className="group panel overflow-hidden transition-all hover:border-border-strong hover:shadow-lift"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={scene.thumb}
                  alt={scene.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <span className="absolute left-3 top-3 rounded-md border border-border bg-background/70 px-2 py-0.5 font-mono text-[11px] backdrop-blur-sm">
                  {String(scene.number).padStart(2, "0")}
                </span>
                <StatusPill status={scene.status} className="absolute right-3 top-3" />
              </div>
              <div className="p-4">
                <p className="font-medium">{scene.title}</p>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{scene.summary}</p>
                <p className="mt-2.5 text-[11px] text-muted-foreground">
                  {scene.duration} · {characters} characters · {scene.assetIds.length} assets
                </p>
              </div>
            </Link>
          );
        })}
        {list.length === 0 ? (
          <div className="panel col-span-full p-16 text-center">
            <p className="text-sm text-muted-foreground">
              No scenes yet — describe the first beat and the agent will build it.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
