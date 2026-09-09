import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/studio-store";
import loginArt from "@/assets/login-art.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio — Describe the scene. Your AI agent builds it." },
      {
        name: "description",
        content:
          "Studio turns natural language into animated scenes using your own characters, backgrounds, props and voices.",
      },
      { property: "og:title", content: "Studio — AI animation production" },
      {
        property: "og:description",
        content: "Build animated episodes from your own characters, worlds, and ideas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useStudio();
  const navigate = useNavigate();

  const enter = () => {
    signIn();
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden overflow-hidden border-r border-border lg:block">
        <img
          src={loginArt}
          alt="Stylized 3D character busts and a wireframe camera rig"
          width={1024}
          height={1280}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-md font-display text-2xl leading-snug tracking-tight">
            Describe the scene.
            <br />
            <span className="text-gradient">Your AI agent builds it.</span>
          </p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Characters, worlds and props from your library — assembled, animated and rendered
            for you.
          </p>
        </div>
      </section>

      <section className="glow-top flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl border border-border bg-elevated">
              <Clapperboard className="size-4 text-primary" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Studio</span>
          </div>

          <h1 className="font-display text-3xl leading-tight tracking-tight">
            Create stories. Let AI animate them.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Build animated videos from your own characters, worlds, and ideas.
          </p>

          <div className="panel mt-8 space-y-4 p-6">
            <Button className="w-full" size="lg" onClick={enter}>
              <GoogleMark />
              Continue with Google
            </Button>
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Prototype — sign-in is simulated, no account is created.
          </p>
        </div>
      </section>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.35 11.1H12v2.9h5.35c-.23 1.4-1.63 4.1-5.35 4.1a5.9 5.9 0 0 1 0-11.8c1.68 0 2.8.72 3.45 1.33l2.35-2.27C16.3 3.93 14.36 3 12 3a9 9 0 1 0 0 18c5.2 0 8.64-3.66 8.64-8.8 0-.59-.06-1.04-.29-2.1Z"
      />
    </svg>
  );
}
