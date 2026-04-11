import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DUMMY_DRIVER_ID = "driver-123";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, price, vehicle, message } = body;

    if (!orderId || !price || !vehicle) {
       return NextResponse.json({ error: "Données incomplètes" }, { status: 400 });
    }

    const newOffer = await prisma.offer.create({
      data: {
        price: parseFloat(price),
        vehicle,
        message: message || null,
        orderId,
        driverId: DUMMY_DRIVER_ID
      }
    });

    return NextResponse.json(newOffer, { status: 201 });
  } catch (error) {
    console.error("Failed to submit offer:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'offre" }, { status: 500 });
  }
}
