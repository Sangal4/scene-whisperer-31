import { createFileRoute, Link } from "@tanstack/react-router";
import { StatusPill } from "@/components/studio/status";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/_studio/episodes/")({
  head: () => ({
    meta: [
      { title: "Episodes — Studio" },
      { name: "description", content: "Every episode across your animated projects." },
      { property: "og:title", content: "Episodes — Studio" },
      { property: "og:description", content: "Every episode across your animated projects." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EpisodesPage,
});

function EpisodesPage() {
  const { episodes, projects, scenes } = useStudio();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <header className="mb-8">
        <h1 className="font-display text-2xl tracking-tight">Episodes</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Every episode across your projects, newest activity first.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {episodes.map((ep) => {
          const project = projects.find((p) => p.id === ep.projectId);
          const sceneCount = scenes.filter((s) => s.episodeId === ep.id).length;
          return (
            <Link
              key={ep.id}
              to="/episodes/$episodeId"
              params={{ episodeId: ep.id }}
              className="group panel overflow-hidden transition-all hover:border-border-strong hover:shadow-lift"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={ep.thumb}
                  alt={ep.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                <div className="absolute inset-x-4 bottom-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">{project?.name}</span>
                  <StatusPill status={ep.status} kind="episode" />
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-muted-foreground">
                  Episode {String(ep.number).padStart(2, "0")}
                </p>
                <p className="mt-0.5 font-medium">{ep.title}</p>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {sceneCount} scenes · {ep.duration} · Edited {ep.edited}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
