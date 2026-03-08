import { Suspense } from "react";
import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product-grid";
import { ProductSearch } from "@/components/product-search";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const { products, total } = await getProducts(50, 0, q);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Products</h1>
      <Suspense fallback={<div className="h-10 bg-gray-100 rounded animate-pulse mb-6" />}>
        <ProductSearch />
      </Suspense>
      {q?.trim() && (
        <p className="mt-4 mb-2 text-sm text-gray-500">
          {total === 0
            ? "No products match your search."
            : `${total} product${total !== 1 ? "s" : ""} found.`}
        </p>
      )}
      <div className="mt-6">
        <ProductGrid products={products} searchQuery={q?.trim() || undefined} />
      </div>
    </main>
  );
}
