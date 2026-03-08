import { prisma } from "@/lib/prisma";
import type { CartResponse } from "@/lib/api-types";

export async function getCartResponse(userId: string): Promise<CartResponse> {
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
