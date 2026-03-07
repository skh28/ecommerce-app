import { NextRequest } from "next/server";
import { json } from "@/lib/api-response";
import type { ProductsListResponse, ProductQuery } from "@/lib/api-types";

const DEFAULT_LIMIT = 50;
const DEFAULT_OFFSET = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || DEFAULT_LIMIT, 100);
  const offset = Math.max(0, Number(searchParams.get("offset")) || DEFAULT_OFFSET);

  // TODO: Implement with Prisma — list products with total count
  const response: ProductsListResponse = {
    products: [],
    total: 0,
  };
  return json(response);
}
