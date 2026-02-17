import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isLandlordRoute = pathname.startsWith("/landlord");
  const isTenantRoute = pathname.startsWith("/tenant");

  if (!isLandlordRoute && !isTenantRoute) return NextResponse.next();

  // Not logged in → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Wrong role → redirect to correct dashboard
  if (isLandlordRoute && token.role !== "LANDLORD") {
    return NextResponse.redirect(new URL("/tenant/dashboard", req.url));
  }
  if (isTenantRoute && token.role !== "TENANT") {
    return NextResponse.redirect(new URL("/landlord/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/landlord/:path*", "/tenant/:path*"],
};