import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, context: { params: Promise<{ offerId: string }> }) {
  try {
    const { offerId } = await context.params;
    const body = await request.json();
    const { action, price } = body;
    // Actions: "COUNTER_BY_CLIENT", "COUNTER_BY_DRIVER", "ACCEPT", "REJECT"

    const offer = await prisma.offer.findUnique({ where: { id: offerId }, include: { order: true } });
    if (!offer) return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });

    if (action === "COUNTER_BY_CLIENT") {
      // Client counters the initial driver's offer
      const updatedOffer = await prisma.offer.update({
        where: { id: offerId },
        data: {
          clientCounterPrice: parseFloat(price),
          lastActionBy: "CLIENT",
          status: "NEGOTIATING",
        }
      });
      return NextResponse.json(updatedOffer);
    }

    if (action === "COUNTER_BY_DRIVER") {
      // Driver counters the client's counter
      const updatedOffer = await prisma.offer.update({
        where: { id: offerId },
        data: {
          driverFinalPrice: parseFloat(price),
          lastActionBy: "DRIVER",
        }
      });
      return NextResponse.json(updatedOffer);
    }

    if (action === "REJECT") {
      const updatedOffer = await prisma.offer.update({
        where: { id: offerId },
        data: { status: "REJECTED" }
      });
      return NextResponse.json(updatedOffer);
    }

    if (action === "ACCEPT") {
      // The Core Matching Logic
      // 1. Accept this specific offer
      await prisma.offer.update({
        where: { id: offerId },
        data: { status: "ACCEPTED" }
      });

      // 2. Reject ALL other offers for this order automatically ("بحجة انه اختار عرضا اخر")
      await prisma.offer.updateMany({
        where: { 
          orderId: offer.orderId,
          id: { not: offerId } 
        },
        data: { status: "REJECTED" }
      });

      // 3. Update the Order status to WAITING and assign the driver!
      await prisma.order.update({
        where: { id: offer.orderId },
        data: { 
          status: "WAITING",
          driverId: offer.driverId
        }
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (error) {
    console.error("Negotiation error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
