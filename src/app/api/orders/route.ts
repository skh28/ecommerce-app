import { NextRequest } from "next/server";
import { json, unauthorized } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import type { OrdersListResponse, OrdersQuery } from "@/lib/api-types";

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || DEFAULT_LIMIT, 100);
  const offset = Math.max(0, Number(searchParams.get("offset")) || DEFAULT_OFFSET);

  // TODO: Implement with Prisma — list orders for session.user.id, newest first, with itemCount
  const response: OrdersListResponse = {
    orders: [],
    total: 0,
  };
  return json(response);
}
