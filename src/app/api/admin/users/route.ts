import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    const where: any = {};
    if (role && role !== "ALL") where.role = role;

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        vehicles: { select: { type: true, status: true } },
        _count: {
          select: {
            ordersAsClient: true,
            ordersAsDriver: true,
          }
        }
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Admin users failed:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
