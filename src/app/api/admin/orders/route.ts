import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "ALL") where.status = status;
    if (search) {
      where.OR = [
        { pickUp: { contains: search, mode: "insensitive" } },
        { dropOff: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        client: { select: { name: true, phone: true } },
        driver: { select: { name: true, phone: true } },
        offers: { select: { id: true, price: true, status: true } },
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Admin orders failed:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
