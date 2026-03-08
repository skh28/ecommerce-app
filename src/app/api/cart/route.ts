import { NextRequest } from "next/server";
import { json, unauthorized, badRequest, notFound } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import { getCartResponse } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import type { AddToCartRequest } from "@/lib/api-types";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  const response = await getCartResponse(session.user.id);
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

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return notFound("Product not found");

  await prisma.cartItem.upsert({
    where: {
      userId_productId: { userId: session.user.id, productId },
    },
    create: {
      userId: session.user.id,
      productId,
      quantity,
    },
    update: { quantity: { increment: quantity } },
  });

  const response = await getCartResponse(session.user.id);
  return json(response);
}
