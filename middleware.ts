import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth";

type Session = typeof auth.$Infer.Session;

export default async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // Debug logging (temporarily for production)
  console.log("URL Path:", request.nextUrl.pathname);
  console.log("Session Cookie:", sessionCookie);
  console.log("Cookies:", request.cookies.toString());

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up");

  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!sessionCookie && !isAuthPage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/library",
    "/add-media",
    "/sign-in",
    "/sign-up",
    "/library/:path*",
  ], // Apply middleware to specific routes
};
