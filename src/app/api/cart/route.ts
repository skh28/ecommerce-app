import { NextRequest } from "next/server";
import { json, unauthorized, badRequest, notFound } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import type { CartResponse, AddToCartRequest } from "@/lib/api-types";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  // TODO: Implement with Prisma — load cart items for session.user.id, include product details
  const response: CartResponse = {
    items: [],
    totalCents: 0,
  };
  return json(response);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  let body: AddToCartRequest;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  const { productId, quantity = 1 } = body;
  if (!productId || typeof productId !== "string") {
    return badRequest("Invalid productId");
  }
  if (typeof quantity !== "number" || quantity < 1 || !Number.isInteger(quantity)) {
    return badRequest("Quantity must be a positive integer");
  }

  // TODO: Implement with Prisma — find product, upsert cart item, return full cart
  const response: CartResponse = {
    items: [],
    totalCents: 0,
  };
  return json(response);
}
