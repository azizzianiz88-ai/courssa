import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DUMMY_DRIVER_ID = "driver-123";

// GET: Fetch all active negotiations for this driver
export async function GET() {
  try {
    const myOffers = await prisma.offer.findMany({
      where: {
        driverId: DUMMY_DRIVER_ID,
        status: { in: ["PENDING", "NEGOTIATING"] }
      },
      include: {
        order: {
          include: { client: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(myOffers);
  } catch (error) {
    console.error("Failed to fetch driver offers:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
