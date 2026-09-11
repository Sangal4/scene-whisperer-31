import { createFileRoute } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/_studio/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Studio" },
      { name: "description", content: "Account, render defaults and agent preferences." },
      { property: "og:title", content: "Settings — Studio" },
      { property: "og:description", content: "Account, render defaults and agent preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useStudio();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8">
        <h1 className="font-display text-2xl tracking-tight">Settings</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Placeholder settings for the prototype — nothing here is saved.
        </p>
      </header>

      <div className="panel divide-y divide-border">
        <div className="space-y-4 p-6">
          <p className="text-sm font-medium">Account</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="s-name">Name</Label>
              <Input id="s-name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-email">Email</Label>
              <Input id="s-email" defaultValue={user.email} />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <p className="text-sm font-medium">Render defaults</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="s-res">Resolution</Label>
              <Input id="s-res" defaultValue="1920 × 1080" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-fps">Frame rate</Label>
              <Input id="s-fps" defaultValue="24 fps" />
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <p className="text-sm font-medium">Animation Director</p>
          {[
            ["Auto-render previews", "Render a preview as soon as the agent finishes a scene."],
            ["Confirm asset changes", "Ask before the agent swaps an asset for another."],
            ["Show agent activity log", "Keep the Blender activity panel open by default."],
          ].map(([title, detail], i) => (
            <div key={title}>
              {i > 0 ? <Separator className="mb-5" /> : null}
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
                </div>
                <Switch defaultChecked={i !== 1} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
