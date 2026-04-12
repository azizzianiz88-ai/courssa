import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, phone, role, vehicleType, vehiclePlate } = await request.json();

    if (!name || !phone || !role) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const normalized = phone.replace(/\s/g, "").trim();

    // Check if user already exists (might have logged in before picking a role)
    let user = await prisma.user.findUnique({ where: { phone: normalized } });

    if (user) {
      // Update existing user info
      user = await prisma.user.update({
        where: { phone: normalized },
        data: { name, role }
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: { name, phone: normalized, role }
      });
    }

    // If driver + vehicle info provided, create first vehicle automatically
    if (role === "DRIVER" && vehicleType) {
      await prisma.vehicle.create({
        data: {
          type: vehicleType,
          plateNumber: vehiclePlate || null,
          ownerId: user.id
        }
      });
    }

    // Set session cookie with real userId
    const response = NextResponse.json({ success: true, userId: user.id, role: user.role });
    response.cookies.set("courssa_session", `${role.toLowerCase()}:${user.id}`, {
      path: "/", maxAge: 60 * 60 * 24 * 30, httpOnly: false
    });
    response.cookies.set("courssa_role", role, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    response.cookies.set("courssa_user_id", user.id, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    return response;

  } catch (error: any) {
    // Unique constraint violation (phone already exists with different data)
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Ce numéro est déjà utilisé" }, { status: 409 });
    }
    console.error("Register error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
