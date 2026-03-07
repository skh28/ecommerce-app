import { NextRequest } from "next/server";
import { json, unauthorized, notFound, badRequest } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import type { CartResponse, UpdateCartItemRequest } from "@/lib/api-types";

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

  // TODO: Implement with Prisma — find cart item by itemId and session.user.id;
  // if quantity === 0, delete item; else update quantity; return full cart
  const response: CartResponse = {
    items: [],
    totalCents: 0,
  };
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

  // TODO: Implement with Prisma — delete cart item, return full cart
  const response: CartResponse = {
    items: [],
    totalCents: 0,
  };
  return json(response);
}
