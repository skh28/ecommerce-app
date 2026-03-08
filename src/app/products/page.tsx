import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product-grid";

export default async function ProductsPage() {
  const { products } = await getProducts();
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Products</h1>
      <ProductGrid products={products} />
    </main>
  );
}
