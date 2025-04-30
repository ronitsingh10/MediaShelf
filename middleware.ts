import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth";

type Session = typeof auth.$Infer.Session;

export default async function middleware(request: NextRequest) {
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up");

  const sessionCookie = getSessionCookie(request);
  console.log("Session cookie:", sessionCookie); // Add this for debugging


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
