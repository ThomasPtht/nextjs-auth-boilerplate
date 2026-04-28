import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/app/lib/jwt";

const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow API auth routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check access token
  const accessToken = req.headers.get("authorization")?.split(" ")[1];

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    verifyAccessToken(accessToken);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
