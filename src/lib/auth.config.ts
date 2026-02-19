import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig: NextAuthConfig = {
  providers: [], // added in auth.ts (Credentials needs Node.js runtime)
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.propertyId = (user as any).propertyId as string | null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const u = session.user as any;
        u.id = token.id as string;
        u.role = token.role as string;
        u.propertyId = (token.propertyId as string) ?? null;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const { pathname } = nextUrl;

      // Public routes — always accessible
      if (
        pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/api/")
      ) {
        return true;
      }

      // Not logged in → redirect to login
      if (!auth?.user) {
        return NextResponse.redirect(new URL("/login", nextUrl));
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const role = (auth.user as any).role;

      // Landlord routes — LANDLORD only
      if (pathname.startsWith("/landlord") && role !== "LANDLORD") {
        return NextResponse.redirect(new URL("/login", nextUrl));
      }

      // Tenant routes — TENANT only
      if (pathname.startsWith("/tenant") && role !== "TENANT") {
        return NextResponse.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
  },
};
