import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function getSession() {
  return await auth();
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}