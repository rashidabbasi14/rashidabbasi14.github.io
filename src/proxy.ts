import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isLoginRoute = createRouteMatcher(["/login(.*)"]);

// List of reserved subdomains that should not be treated as usernames
const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "admin",
  "api",
  "mail",
  "login",
  "signup",
  "auth",
  "dashboard",
  "docs",
  "help",
  "support",
  "status",
  "blog",
  "about",
  "contact",
  "terms",
  "privacy",
  "onboarding",
]);

/**
 * The main domain where the app is hosted (e.g., "portfoliobuilder.com").
 * Subdomain rewrites (e.g., username.portfoliobuilder.com → /username)
 * are ONLY applied when the hostname ends with this domain.
 *
 * Falls back to the Vercel deployment URL in preview environments so
 * that subdomain detection does NOT incorrectly rewrite Vercel's
 * `*.vercel.app` URLs.
 */
const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "";

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0]; // Remove port if present

  // ─── Subdomain Detection ────────────────────────────────────────────
  // Only apply subdomain rewrites when the hostname ends with the
  // configured MAIN_DOMAIN (e.g., "portfoliobuilder.com").
  // This prevents Vercel deployment URLs (e.g., app.vercel.app) from
  // being incorrectly treated as user subdomains.
  if (MAIN_DOMAIN && hostname.endsWith(`.${MAIN_DOMAIN}`)) {
    const subdomain = hostname.slice(0, -(MAIN_DOMAIN.length + 1)).toLowerCase();

    // Skip reserved subdomains
    if (!RESERVED_SUBDOMAINS.has(subdomain)) {
      // Rewrite to the portfolio page for this username
      // The (public)/[userId]/ route group serves at /[userId]
      const newPathname = url.pathname === "/" ? "" : url.pathname;
      const newUrl = new URL(
        `/${subdomain}${newPathname}${url.search}`,
        url.origin
      );
      return NextResponse.rewrite(newUrl);
    }
  }

  // ─── Admin Route Protection ─────────────────────────────────────────
  if (isAdminRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/login", url.origin);
      loginUrl.searchParams.set("redirect_url", url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ─── Login Route - redirect to admin if already signed in ───────────
  if (isLoginRoute(req)) {
    const { userId } = await auth();
    if (userId) {
      return NextResponse.redirect(new URL("/admin", url.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and webhooks
    "/((?!_next/static|_next/image|favicon|uploads|api/public|api/webhooks).*)",
  ],
};
