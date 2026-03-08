import { NextRequest } from "next/server";
import { json, unauthorized, badRequest, notFound } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CartResponse, AddToCartRequest } from "@/lib/api-types";

async function getCartResponse(userId: string): Promise<CartResponse> {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  const cartItems = items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.product.name,
    priceCents: item.product.priceCents,
    quantity: item.quantity,
    imageUrl: item.product.imageUrl,
  }));
  const totalCents = cartItems.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
  return { items: cartItems, totalCents };
}

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
