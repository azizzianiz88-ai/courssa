import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let orders = await prisma.order.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: { name: true, photoUrl: true }
        }
      }
    });

    // For prototyping: Seed 2 dummy orders if database is entirely empty
    if (orders.length === 0) {
      const dummyClient = await prisma.user.upsert({
        where: { phone: "0600000000" },
        update: {},
        create: {
          id: "client-mock-1",
          name: "Amine Client",
          phone: "0600000000",
          role: "CLIENT",
        }
      });
      
      const mockedOrder1 = await prisma.order.create({
        data: {
          clientId: dummyClient.id,
          title: "Transport de Canapé et Table",
          pickUp: "Alger Centre",
          dropOff: "Bab Ezzouar",
          type: "Meubles",
          urgency: "Aujourd'hui",
          description: "Un grand canapé 3 places et une petite table basse, au 2ème étage.",
        },
        include: { client: true }
      });
      
      const mockedOrder2 = await prisma.order.create({
        data: {
          clientId: dummyClient.id,
          title: "Cartons de Marchandises",
          pickUp: "Rouiba, Zone Industrielle",
          dropOff: "Blida, Centreville",
          type: "Marchandise",
          urgency: "Demain",
          description: "14 cartons moyens de vêtements.",
        },
        include: { client: true }
      });
      
      orders = [mockedOrder1, mockedOrder2] as any;
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch pending orders", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
