import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Dummy driver ID for prototyping until full auth is wired
const DUMMY_DRIVER_ID = "driver-123";

// Ensure dummy user exists for foreign key constraints
async function ensureDummyUser() {
  try {
    const user = await prisma.user.findUnique({ where: { id: DUMMY_DRIVER_ID } });
    if (!user) {
      await prisma.user.create({
        data: {
          id: DUMMY_DRIVER_ID,
          name: "Chauffeur Test",
          phone: "0555555555",
          role: "DRIVER",
        }
      });
    }
  } catch (err) {
    console.error("DB Connection issue, skipping user creation", err);
  }
}

export async function GET() {
  try {
    await ensureDummyUser();
    const vehicles = await prisma.vehicle.findMany({
      where: { ownerId: DUMMY_DRIVER_ID },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles. Check DB connection." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureDummyUser();
    const body = await request.json();
    const { type, capacity, plateNumber, photoUrl } = body;

    if (!type) {
      return NextResponse.json({ error: "Vehicle type is required" }, { status: 400 });
    }

    const newVehicle = await prisma.vehicle.create({
      data: {
        type,
        capacity: capacity ? parseFloat(capacity) : null,
        plateNumber: plateNumber || null,
        photoUrl: photoUrl || null,
        status: "AVAILABLE",
        ownerId: DUMMY_DRIVER_ID
      }
    });

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error("Failed to create vehicle:", error);
    return NextResponse.json({ error: "Failed to create vehicle. Check DB connection." }, { status: 500 });
  }
}
