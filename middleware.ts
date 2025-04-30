import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth";

type Session = typeof auth.$Infer.Session;

export default async function middleware(request: NextRequest) {
  // const sessionCookie = getSessionCookie(request);
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      },
    }
  );

  // Debug logging (temporarily for production)
  console.log("URL Path:", request.nextUrl.pathname);
  console.log("Session Cookie:", session);
  console.log("Cookies:", request.cookies.toString());

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up");

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!session && !isAuthPage) {
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
