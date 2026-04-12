import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("courssa_session")?.value;
    const [, clientId] = (session || "").split(":");

    if (!clientId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { pickUp, dropOff, stop, type, description, urgency, hasInvoice, needWorkers, workersPayer } = body;

    if (!pickUp || !dropOff || !description) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        title: `De ${pickUp}${stop ? " via " + stop : ""} à ${dropOff}`,
        pickUp,
        dropOff,
        stop: stop || null,
        type: type || "Non spécifié",
        description,
        urgency: urgency || "Normal (+ de 48h)",
        hasInvoice: !!hasInvoice,
        needWorkers: !!needWorkers,
        workersPayer: workersPayer || null,
        requestedVehicle: type || null,
        clientId,
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("courssa_session")?.value;
    const [, clientId] = (session || "").split(":");

    if (!clientId) {
      return NextResponse.json([], { status: 200 });
    }

    const orders = await prisma.order.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      include: {
        offers: {
          where: { status: { not: "REJECTED" } },
          include: { driver: { select: { name: true, phone: true, rating: true } } },
          orderBy: { price: "asc" }
        }
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetch client orders error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
