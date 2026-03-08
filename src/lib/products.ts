import { prisma } from "@/lib/prisma";
import type { ProductDto } from "@/lib/api-types";

export async function getProducts(
  limit = 50,
  offset = 0,
  search?: string
): Promise<{ products: ProductDto[]; total: number }> {
  const trimmed = search?.trim().toLowerCase();
  if (!trimmed) {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.product.count(),
    ]);
    return { products: products.map(mapProduct), total };
  }

  const all = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  const filtered = all.filter(
    (p) =>
      p.name.toLowerCase().includes(trimmed) ||
      (p.description?.toLowerCase().includes(trimmed) ?? false)
  );
  const total = filtered.length;
  const products = filtered.slice(offset, offset + limit).map(mapProduct);
  return { products, total };
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
