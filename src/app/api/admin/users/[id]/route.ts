import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/users/[id] — change role or update user
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await prisma.user.update({
      where: { id },
      data: { ...(body.role && { role: body.role }), ...(body.name && { name: body.name }) },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Admin update user failed:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] — remove user
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    // Delete related orders first (cascade not set for client)
    await prisma.order.deleteMany({ where: { clientId: id } });
    await prisma.vehicle.deleteMany({ where: { ownerId: id } });
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete user failed:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

// GET /api/admin/users/[id] — full user details
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        vehicles: true,
        ordersAsClient: { orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, status: true, createdAt: true } },
        ordersAsDriver: { orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, status: true, createdAt: true } },
        _count: { select: { ordersAsClient: true, ordersAsDriver: true } }
      }
    });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
