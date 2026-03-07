import { unauthorized, badRequest, created } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import type { CheckoutResponse } from "@/lib/api-types";

export async function POST() {
  const session = await getSession();
  if (!session) return unauthorized();

  // TODO: Implement with Prisma:
  // 1. Load cart items for session.user.id
  // 2. If empty, return badRequest("Cart is empty")
  // 3. Create Order, create OrderItems from cart (snapshot priceCents), sum totalCents
  // 4. Delete user's cart items
  // 5. Return created({ order: { id, totalCents, createdAt, items } })
  return badRequest("Cart is empty");
}
