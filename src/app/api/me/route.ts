import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("courssa_session")?.value;

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Session format: "role:userId" e.g. "client:clxxx123"
    const [role, userId] = session.split(":");

    if (!userId || role === "admin") {
      return NextResponse.json({ 
        id: "admin", name: "Super Admin", phone: "0771005952", role: "ADMIN" 
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, phone: true, role: true, rating: true, createdAt: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/me failed:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
