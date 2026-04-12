import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Super Admin phone is stored in environment variable for security
const SUPER_ADMIN_PHONE = process.env.ADMIN_PHONE || "0771005952";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

    const normalized = phone.replace(/\s/g, "").trim();

    // ─── Super Admin check ───────────────────────────────────────
    if (normalized === SUPER_ADMIN_PHONE) {
      const response = NextResponse.json({ role: "ADMIN", redirect: "/admin" });
      response.cookies.set("courssa_session", `admin:${normalized}`, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: false,
      });
      response.cookies.set("courssa_role", "ADMIN", { path: "/", maxAge: 60 * 60 * 24 * 7 });
      return response;
    }

    // ─── Look up existing user in DB ─────────────────────────────
    try {
      const user = await prisma.user.findUnique({ where: { phone: normalized } });

      if (user) {
        const redirectMap: Record<string, string> = {
          CLIENT: "/client",
          DRIVER: "/driver",
          ADMIN:  "/admin",
        };
        const redirect = redirectMap[user.role] ?? "/auth";
        const response = NextResponse.json({ role: user.role, redirect, userId: user.id });
        response.cookies.set("courssa_session", `${user.role.toLowerCase()}:${user.id}`, {
          path: "/", maxAge: 60 * 60 * 24 * 7, httpOnly: false
        });
        response.cookies.set("courssa_role", user.role, { path: "/", maxAge: 60 * 60 * 24 * 7 });
        return response;
      }
    } catch (dbErr) {
      console.error("DB lookup failed (no DB connected yet):", dbErr);
      // Fall through: DB might not be connected in dev → go to new user flow
    }

    // ─── New user: ask them to pick a role ───────────────────────
    return NextResponse.json({ role: "NEW", redirect: null, phone: normalized });

  } catch (error) {
    console.error("Auth login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
