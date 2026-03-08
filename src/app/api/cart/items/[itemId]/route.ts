import { NextRequest } from "next/server";
import { json, unauthorized, notFound, badRequest } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import { getCartResponse } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import type { UpdateCartItemRequest } from "@/lib/api-types";

type RouteContext = { params: Promise<{ itemId: string }> };

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { itemId } = await context.params;
  if (!itemId) return notFound("Cart item not found");

  let body: UpdateCartItemRequest;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  const { quantity } = body;
  if (typeof quantity !== "number" || quantity < 0 || !Number.isInteger(quantity)) {
    return badRequest("Quantity must be a non-negative integer");
  }

  const existing = await prisma.cartItem.findFirst({
    where: { id: itemId, userId: session.user.id },
  });
  if (!existing) return notFound("Cart item not found");

  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  const response = await getCartResponse(session.user.id);
  return json(response);
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { itemId } = await context.params;
  if (!itemId) return notFound("Cart item not found");

  const existing = await prisma.cartItem.findFirst({
    where: { id: itemId, userId: session.user.id },
  });
  if (!existing) return notFound("Cart item not found");

  await prisma.cartItem.delete({ where: { id: itemId } });

  const response = await getCartResponse(session.user.id);
  return json(response);
}
