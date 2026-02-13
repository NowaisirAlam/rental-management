import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Public routes — always accessible
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  // Not logged in → redirect to login
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = session.user.role;

  // Landlord routes — LANDLORD only
  if (pathname.startsWith("/landlord") && role !== "LANDLORD") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Tenant routes — TENANT only
  if (pathname.startsWith("/tenant") && role !== "TENANT") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};