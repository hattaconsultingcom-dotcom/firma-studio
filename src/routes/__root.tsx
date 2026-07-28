import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Shell } from "../components/studio/Shell";
import { AuthProvider, useAuth } from "../lib/auth";
import { Loader2 } from "lucide-react";

const PRIVATE_PREFIXES = [
  "/architecture",
  "/website",
  "/landing",
  "/blog",
  "/resources",
  "/docs",
  "/academy",
  "/case-studies",
  "/templates",
  "/help",
  "/changelog",
  "/newsletter",
  "/seo",
  "/analytics",
  "/integrations",
  "/media",
  "/redirects",
  "/taxonomy",
  "/team",
  "/settings",
];

function isPrivateRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  return PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isPublicRoute(pathname: string): boolean {
  return pathname === "/journal" || pathname.startsWith("/journal/");
}

function NotFoundComponent() {
  return (
    <Shell>
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="eyebrow mb-3">404 · Not found</div>
        <h1 className="h-display text-3xl">This screen doesn't exist yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for isn't part of FIRMA Studio.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-95"
          >
            Back to Overview
          </Link>
        </div>
      </div>
    </Shell>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow mb-2">Studio · Runtime error</div>
        <h1 className="h-display text-2xl">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head back home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-md border border-border bg-card px-4 py-2 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FIRMA Studio — Internal publishing & marketing OS" },
      { name: "description", content: "Internal FIRMA admin platform for managing the public website, blog, resources, SEO, media and analytics." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "FIRMA Studio" },
      { property: "og:description", content: "Internal publishing and marketing operating system for the FIRMA team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500&family=JetBrains+Mono:wght@400;500&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPublic = isPublicRoute(pathname);
  const isLogin = pathname === "/login";

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {isPublic || isLogin ? (
          <Outlet />
        ) : (
          <AuthGuard>
            <Shell>
              <Outlet />
            </Shell>
          </AuthGuard>
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AuthGuard({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/login", search: { redirect: pathname } });
    }
  }, [session, loading, navigate, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Loading studio…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
