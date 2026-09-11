import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/studio-data";

export const Route = createFileRoute("/_studio/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Studio" },
      { name: "description", content: "Scene and episode starting points for your animated series." },
      { property: "og:title", content: "Templates — Studio" },
      {
        property: "og:description",
        content: "Scene and episode starting points for your animated series.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TemplatesPage,
});

const templates = [
  {
    name: "Explainer Episode",
    detail: "6 scenes · Teacher + whiteboard beats",
    cover: images.coverMaya,
  },
  { name: "Two-Character Dialogue", detail: "3 scenes · Shot / reverse shot", cover: images.sceneClassroom },
  { name: "City Short", detail: "4 scenes · Exterior establishing beats", cover: images.bgDelhi },
  { name: "Cold Open Mystery", detail: "2 scenes · Close-up reveal", cover: images.coverSignal },
];

function TemplatesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <header className="mb-8">
        <h1 className="font-display text-2xl tracking-tight">Templates</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Pre-planned scene structures the agent can fill with your own assets.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {templates.map((t) => (
          <div key={t.name} className="panel overflow-hidden">
            <img
              src={t.cover}
              alt={t.name}
              loading="lazy"
              className="aspect-video w-full object-cover"
            />
            <div className="space-y-3 p-4">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t.detail}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => toast(`${t.name} applied to a new episode`)}
              >
                Use template
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
