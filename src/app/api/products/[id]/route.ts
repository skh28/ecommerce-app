import { NextRequest } from "next/server";
import { json, notFound } from "@/lib/api-response";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;

  // TODO: Implement with Prisma — find product by id
  // if (!product) return notFound("Product not found");
  // return json(product);

  return notFound("Product not found");
}
