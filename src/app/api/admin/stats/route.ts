import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalOrders,
      pendingOrders,
      activeOrders,
      completedOrders,
      cancelledOrders,
      totalUsers,
      totalDrivers,
      totalClients,
      totalOffers,
      totalVehicles,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: { in: ["NEGOTIATING", "WAITING", "LOADING", "IN_TRANSIT", "UNLOADING"] } } }),
      prisma.order.count({ where: { status: "COMPLETED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.user.count(),
      prisma.user.count({ where: { role: "DRIVER" } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.offer.count(),
      prisma.vehicle.count(),
    ]);

    return NextResponse.json({
      orders: { total: totalOrders, pending: pendingOrders, active: activeOrders, completed: completedOrders, cancelled: cancelledOrders },
      users: { total: totalUsers, drivers: totalDrivers, clients: totalClients },
      offers: { total: totalOffers },
      vehicles: { total: totalVehicles },
    });
  } catch (error) {
    console.error("Admin stats failed:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
