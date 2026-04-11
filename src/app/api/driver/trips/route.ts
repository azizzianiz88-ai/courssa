import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DUMMY_DRIVER_ID = "driver-123";

// GET: Fetch active trip (WAITING/LOADING/IN_TRANSIT/UNLOADING) and past trips (COMPLETED)
export async function GET() {
  try {
    const activeOrder = await prisma.order.findFirst({
      where: {
        driverId: DUMMY_DRIVER_ID,
        status: { in: ["WAITING", "LOADING", "IN_TRANSIT", "UNLOADING"] }
      },
      include: { client: { select: { name: true, phone: true } } }
    });

    const pastOrders = await prisma.order.findMany({
      where: { driverId: DUMMY_DRIVER_ID, status: "COMPLETED" },
      orderBy: { updatedAt: "desc" },
      take: 10
    });

    return NextResponse.json({ active: activeOrder, past: pastOrders });
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}

// PATCH: Advance trip to next stage
export async function PATCH(request: Request) {
  try {
    const { orderId, action } = await request.json();

    const STAGE_MAP: Record<string, string> = {
      WAITING: "LOADING",
      LOADING: "IN_TRANSIT",
      IN_TRANSIT: "UNLOADING",
      UNLOADING: "COMPLETED",
    };

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const nextStatus = STAGE_MAP[order.status];
    if (!nextStatus) return NextResponse.json({ error: "No next stage" }, { status: 400 });

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: nextStatus as any }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to advance trip:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
