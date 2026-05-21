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

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0]; // Remove port if present

  // ─── Subdomain Detection ────────────────────────────────────────────
  // Check if we're on a subdomain (e.g., rashidabbasi.portfoliobuilder.com)
  const parts = hostname.split(".");
  const isSubdomain = parts.length > 2; // e.g., ["rashidabbasi", "portfoliobuilder", "com"]

  if (isSubdomain) {
    const subdomain = parts[0].toLowerCase();

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
