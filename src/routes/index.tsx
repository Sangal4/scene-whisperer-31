import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clapperboard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
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

type Mode = "signin" | "signup";

function LoginPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard", replace: true });
  }, [loading, session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setCheckEmail(true);
          return;
        }
        navigate({ to: "/dashboard", replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  };

  const reset = async () => {
    if (!email) {
      toast.error("Enter your email first, then tap reset.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent. Check your inbox.");
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
            Characters, worlds and props from your library — assembled, animated and rendered for
            you.
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
            {mode === "signin" ? "Welcome back." : "Create stories. Let AI animate them."}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {mode === "signin"
              ? "Sign in to pick up where your episodes left off."
              : "Build animated videos from your own characters, worlds, and ideas."}
          </p>

          {checkEmail ? (
            <div className="panel mt-8 space-y-3 p-6">
              <p className="text-sm font-medium">Confirm your email</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We sent a confirmation link to {email}. Open it to activate your account, then come
                back and sign in.
              </p>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setCheckEmail(false);
                  setMode("signin");
                }}
              >
                Back to sign in
              </Button>
            </div>
          ) : (
            <div className="panel mt-8 space-y-5 p-6">
              <Button
                variant="secondary"
                className="w-full"
                size="lg"
                onClick={google}
                disabled={busy}
              >
                <GoogleMark />
                Continue with Google
              </Button>

              <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground/70">
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
              </div>

              <form className="space-y-4" onSubmit={submit}>
                {mode === "signup" ? (
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jatin Mehra"
                      autoComplete="name"
                    />
                  </div>
                ) : null}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@studio.app"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={busy}>
                  {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                  {mode === "signin" ? "Sign in" : "Create account"}
                </Button>
              </form>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <button
                  type="button"
                  className="transition-colors hover:text-foreground"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                >
                  {mode === "signin" ? "Create an account" : "I already have an account"}
                </button>
                {mode === "signin" ? (
                  <button
                    type="button"
                    className="transition-colors hover:text-foreground"
                    onClick={reset}
                  >
                    Forgot password?
                  </button>
                ) : null}
              </div>
            </div>
          )}

          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
            By continuing, you agree to our Terms and Privacy Policy.
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
