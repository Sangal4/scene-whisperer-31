import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Film, Plus, Upload, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewProjectDialog } from "@/components/studio/new-project-dialog";
import { SectionHeading, StatusPill } from "@/components/studio/status";
import { useStudio } from "@/lib/studio-store";
import { images } from "@/lib/studio-data";

export const Route = createFileRoute("/_studio/dashboard")({
  head: () => ({
    meta: [
      { title: "Home — Studio" },
      { name: "description", content: "Your recent animated projects and works in progress." },
      { property: "og:title", content: "Home — Studio" },
      { property: "og:description", content: "Your recent animated projects and works in progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const quickStart = [
  { label: "New Project", icon: Plus },
  { label: "Import Assets", icon: Upload },
  { label: "Create Character", icon: UserPlus },
  { label: "Create Episode", icon: Film },
];

function Dashboard() {
  const { user, projects } = useStudio();

  return (
    <div className="glow-top min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl tracking-tight">Good morning, {user.name}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Continue creating something.</p>
          </div>
          <NewProjectDialog
            trigger={
              <Button>
                <Plus className="size-4" /> New Project
              </Button>
            }
          />
        </header>

        <section className="mb-12">
          <SectionHeading
            title="Recent Projects"
            action={
              <Link
                to="/projects"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View all
              </Link>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {projects.map((p) => (
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
                  <span className="absolute right-3 top-3 rounded-full border border-border bg-background/70 px-2 py-0.5 text-[11px] backdrop-blur-sm">
                    {p.status}
                  </span>
                </div>
                <div className="space-y-2 p-4">
                  <p className="font-medium">{p.name}</p>
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  <p className="pt-1 text-[11px] text-muted-foreground">
                    {p.episodes} episodes · Edited {p.edited}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <SectionHeading title="Continue Working" />
          <Link
            to="/scenes/$sceneId"
            params={{ sceneId: "sc-03" }}
            className="group panel grid overflow-hidden md:grid-cols-[420px_1fr]"
          >
            <div className="relative aspect-video overflow-hidden md:aspect-auto">
              <img
                src={images.sceneClassroom}
                alt="Scene 03 preview"
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center gap-3 p-8">
              <StatusPill status="in-progress" kind="episode" className="w-fit" />
              <div>
                <p className="text-sm text-muted-foreground">Professor Maya</p>
                <h3 className="mt-1 font-display text-xl tracking-tight">
                  Episode 03 — The Missing Signal
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Scene 07 · Last edited 2 hours ago
                </p>
              </div>
              <span className="mt-2 inline-flex w-fit items-center gap-2 text-sm text-primary">
                Continue editing
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </section>

        <section>
          <SectionHeading title="Quick Start" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickStart.map(({ label, icon: Icon }) =>
              label === "New Project" ? (
                <NewProjectDialog
                  key={label}
                  trigger={
                    <button className="panel flex items-center gap-3 p-4 text-left text-sm transition-colors hover:border-border-strong">
                      <span className="grid size-9 place-items-center rounded-lg bg-elevated text-primary">
                        <Icon className="size-4" />
                      </span>
                      {label}
                    </button>
                  }
                />
              ) : (
                <Link
                  key={label}
                  to={label === "Import Assets" || label === "Create Character" ? "/library" : "/episodes"}
                  className="panel flex items-center gap-3 p-4 text-left text-sm transition-colors hover:border-border-strong"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-elevated text-primary">
                    <Icon className="size-4" />
                  </span>
                  {label}
                </Link>
              ),
            )}
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Boxes className="size-3.5" />
            Prototype data — every project, asset and render here is simulated.
          </p>
        </section>
      </div>
    </div>
  );
}
