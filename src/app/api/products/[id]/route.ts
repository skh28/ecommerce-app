import { NextRequest } from "next/server";
import { json, notFound } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import type { ProductDto } from "@/lib/api-types";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return notFound("Product not found");

  const dto: ProductDto = {
    id: product.id,
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    imageUrl: product.imageUrl,
  };
  return json(dto);
}
