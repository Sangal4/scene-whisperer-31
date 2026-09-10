import { useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { Download, Plus, Settings2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { AssetThumb, kindLabel } from "@/components/studio/asset-card";
import { assets } from "@/lib/studio-data";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/_studio/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project workspace — Studio" },
      { name: "description", content: "Episodes, assets and settings for your animated series." },
      { property: "og:title", content: "Project workspace — Studio" },
      { property: "og:description", content: "Episodes, assets and settings for your animated series." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const { projectId } = useParams({ from: "/_studio/projects/$projectId" });
  const { projects, episodes, scenes, addEpisode } = useStudio();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const project = projects.find((p) => p.id === projectId);
  const list = episodes.filter((e) => e.projectId === projectId);

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-xl">Project not found</h1>
        <Link to="/projects" className="mt-4 inline-block text-sm text-primary">
          Back to projects
        </Link>
      </div>
    );
  }

  const create = () => {
    const ep = addEpisode(project.id, title.trim());
    setOpen(false);
    setTitle("");
    toast.success(`Episode ${ep.number} created`);
    navigate({ to: "/episodes/$episodeId", params: { episodeId: ep.id } });
  };

  const grouped = (["character", "background", "prop", "voice"] as const).map((kind) => ({
    kind,
    items: assets.filter((a) => a.kind === kind).slice(0, 4),
    total: assets.filter((a) => a.kind === kind).length,
  }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/projects" className="transition-colors hover:text-foreground">
          Projects
        </Link>
        <span>/</span>
        <span className="text-foreground">{project.name}</span>
      </nav>

      <header className="panel mb-10 grid overflow-hidden lg:grid-cols-[420px_1fr]">
        <img
          src={project.cover}
          alt={project.name}
          loading="lazy"
          className="aspect-video size-full object-cover lg:aspect-auto"
        />
        <div className="flex flex-col justify-center gap-4 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl tracking-tight">{project.name}</h1>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast("Share link copied")}>
                <Share2 className="size-4" /> Share
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate({ to: "/settings" })}>
                <Settings2 className="size-4" /> Settings
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast("Export queued")}>
                <Download className="size-4" /> Export
              </Button>
            </div>
          </div>
          <dl className="flex flex-wrap gap-x-10 gap-y-3 pt-2 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Episodes</dt>
              <dd className="mt-0.5">{list.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Style</dt>
              <dd className="mt-0.5">{project.style}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Aspect ratio</dt>
              <dd className="mt-0.5">{project.ratio}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Last edited</dt>
              <dd className="mt-0.5">{project.edited}</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="mb-12">
        <SectionHeading
          title="Project Assets"
          subtitle="Pulled from your library — the agent uses these when building scenes."
          action={
            <Link to="/library" className="text-sm text-muted-foreground hover:text-foreground">
              Open library
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {grouped.map(({ kind, items, total }) => (
            <div key={kind} className="panel p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium">{kindLabel[kind]}s</p>
                <span className="text-[11px] text-muted-foreground">{total}</span>
              </div>
              <div className="flex -space-x-2">
                {items.map((a) => (
                  <AssetThumb
                    key={a.id}
                    asset={a}
                    rounded="rounded-lg"
                    className="size-12 border border-border"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          title="Episodes"
          action={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="size-4" /> New Episode
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>New episode</DialogTitle>
                  <DialogDescription>
                    Give it a title — you can add scenes right after.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-2">
                  <Label htmlFor="ep-title">Episode title</Label>
                  <Input
                    id="ep-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="The Experiment"
                  />
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={create}>Create Episode</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="space-y-3">
          {list.map((ep) => {
            const sceneCount = scenes.filter((s) => s.episodeId === ep.id).length;
            return (
              <Link
                key={ep.id}
                to="/episodes/$episodeId"
                params={{ episodeId: ep.id }}
                className="group panel flex items-center gap-5 p-3 transition-colors hover:border-border-strong"
              >
                <img
                  src={ep.thumb}
                  alt={ep.title}
                  loading="lazy"
                  className="aspect-video w-44 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    Episode {String(ep.number).padStart(2, "0")}
                  </p>
                  <p className="mt-0.5 truncate font-medium">{ep.title}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {sceneCount} scenes · {ep.duration} · Edited {ep.edited}
                  </p>
                </div>
                <StatusPill status={ep.status} kind="episode" />
              </Link>
            );
          })}
          {list.length === 0 ? (
            <div className="panel p-12 text-center">
              <p className="text-sm text-muted-foreground">
                No episodes yet. Create the first one to start building scenes.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
