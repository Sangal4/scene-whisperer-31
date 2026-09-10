import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewProjectDialog } from "@/components/studio/new-project-dialog";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/_studio/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Studio" },
      { name: "description", content: "All of your animated series and shorts in one place." },
      { property: "og:title", content: "Projects — Studio" },
      { property: "og:description", content: "All of your animated series and shorts in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects, episodes } = useStudio();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-tight">Projects</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Each project holds its episodes, scenes and production settings.
          </p>
        </div>
        <NewProjectDialog
          trigger={
            <Button>
              <Plus className="size-4" /> New Project
            </Button>
          }
        />
      </header>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => {
          const count = episodes.filter((e) => e.projectId === p.id).length || p.episodes;
          return (
            <Link
              key={p.id}
              to="/projects/$projectId"
              params={{ projectId: p.id }}
              className="group panel overflow-hidden transition-all hover:border-border-strong hover:shadow-lift"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={p.cover}
                  alt={p.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
              <div className="space-y-2 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{p.name}</p>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                    {p.status}
                  </span>
                </div>
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <p className="pt-1 text-[11px] text-muted-foreground">
                  {count} episodes · {p.style} · {p.ratio}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
