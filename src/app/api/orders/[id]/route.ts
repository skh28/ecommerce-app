import { NextRequest } from "next/server";
import { json, unauthorized, notFound } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrderDetailResponse } from "@/lib/api-types";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await context.params;

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: { include: { product: true } } },
  });
  if (!order) return notFound("Order not found");

  const response: OrderDetailResponse = {
    id: order.id,
    totalCents: order.totalCents,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((i) => ({
      productId: i.productId,
      productName: i.product.name,
      quantity: i.quantity,
      priceCents: i.priceCents,
    })),
  };
  return json(response);
}
