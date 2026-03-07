import { NextRequest } from "next/server";
import { json, unauthorized, notFound } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import type { OrderDetailResponse } from "@/lib/api-types";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await context.params;

  // TODO: Implement with Prisma — find order by id where userId === session.user.id, include items
  return notFound("Order not found");
}
