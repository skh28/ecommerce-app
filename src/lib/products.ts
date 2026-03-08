import { prisma } from "@/lib/prisma";
import type { ProductDto } from "@/lib/api-types";

export async function getProducts(limit = 50, offset = 0): Promise<{ products: ProductDto[]; total: number }> {
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.product.count(),
  ]);
  return {
    products: products.map(mapProduct),
    total,
  };
}

function mapProduct(p: { id: string; name: string; description: string | null; priceCents: number; imageUrl: string | null }): ProductDto {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    priceCents: p.priceCents,
    imageUrl: p.imageUrl,
  };
}

export async function getProduct(id: string): Promise<ProductDto | null> {
  const product = await prisma.product.findUnique({ where: { id } });
  return product ? mapProduct(product) : null;
}
