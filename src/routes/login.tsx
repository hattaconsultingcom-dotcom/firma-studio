import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { StudioLogo } from "@/components/studio/Logo";
import { Loader2, Lock, Mail, User as UserIcon, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · FIRMA Studio" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { session, loading, signIn, signUp, error } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) {
      navigate({ to: "/" });
    }
  }, [session, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);

    if (!email || !password) {
      setLocalError("Email and password are required.");
      setSubmitting(false);
      return;
    }

    if (mode === "signup") {
      const { error: signUpError } = await signUp(email, password, fullName || "Owner");
      if (signUpError) setLocalError(signUpError);
    } else {
      const { error: signInError } = await signIn(email, password);
      if (signInError) setLocalError(signInError);
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <StudioLogo />
        </div>

        <div className="surface-card p-6">
          <div className="mb-6 text-center">
            <div className="eyebrow mb-2">FIRMA Studio</div>
            <h1 className="h-display text-2xl">
              {mode === "signin" ? "Sign in" : "Create your account"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Enter your credentials to access the studio."
                : "Set up your owner account to get started."}
            </p>
          </div>

          {(localError || error) && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{localError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <label className="block space-y-1.5">
                <div className="mono-label">Full name</div>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Amina Fassi"
                    className="w-full h-9 rounded-md border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </label>
            )}

            <label className="block space-y-1.5">
              <div className="mono-label">Email</div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@farma.farm"
                  className="w-full h-9 rounded-md border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                  autoComplete="email"
                />
              </div>
            </label>

            <label className="block space-y-1.5">
              <div className="mono-label">Password</div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 rounded-md border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-95 disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            {mode === "signin" ? (
              <>
                Need an account?{" "}
                <button
                  onClick={() => { setMode("signup"); setLocalError(null); }}
                  className="font-medium text-foreground hover:underline"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => { setMode("signin"); setLocalError(null); }}
                  className="font-medium text-foreground hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <Link to="/journal" className="hover:text-foreground hover:underline">
            View public Journal
          </Link>
        </div>
      </div>
    </div>
  );
}
