import { unauthorized, badRequest, created } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CheckoutResponse } from "@/lib/api-types";

export async function POST() {
  const session = await getSession();
  if (!session) return unauthorized();

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) return badRequest("Cart is empty");

  const totalCents = cartItems.reduce(
    (sum, i) => sum + i.product.priceCents * i.quantity,
    0
  );

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: {
        userId: session.user.id,
        totalCents,
        items: {
          create: cartItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            priceCents: i.product.priceCents,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    }),
    prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    }),
  ]);

  const response: CheckoutResponse = {
    order: {
      id: order.id,
      totalCents: order.totalCents,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((i) => ({
        productId: i.productId,
        productName: i.product.name,
        quantity: i.quantity,
        priceCents: i.priceCents,
      })),
    },
  };
  return created(response);
}
