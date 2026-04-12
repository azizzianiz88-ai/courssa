import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Clear all session cookies
  response.cookies.set("courssa_session", "", { path: "/", maxAge: 0 });
  response.cookies.set("courssa_role", "", { path: "/", maxAge: 0 });
  return response;
}
