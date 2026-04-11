import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mocking client identity for prototyping logic
const DUMMY_CLIENT_ID = "client-mock-1";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: { clientId: DUMMY_CLIENT_ID },
      orderBy: { createdAt: 'desc' },
      include: {
        offers: {
            orderBy: { price: 'asc' } // Show lowest offers first
        }
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch client orders", error);
    return NextResponse.json({ error: "Failed to fetch client orders" }, { status: 500 });
  }
}
