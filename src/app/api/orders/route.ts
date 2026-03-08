import { NextRequest } from "next/server";
import { json, unauthorized } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrdersListResponse } from "@/lib/api-types";

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || DEFAULT_LIMIT, 100);
  const offset = Math.max(0, Number(searchParams.get("offset")) || DEFAULT_OFFSET);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      include: { _count: { select: { items: true } } },
    }),
    prisma.order.count({ where: { userId: session.user.id } }),
  ]);

  const response: OrdersListResponse = {
    orders: orders.map((o) => ({
      id: o.id,
      totalCents: o.totalCents,
      createdAt: o.createdAt.toISOString(),
      itemCount: o._count.items,
    })),
    total,
  };
  return json(response);
}
