import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { ProductDetail } from "@/components/product-detail";

type Props = { params: Promise<{ id: string }> };

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <main className="max-w-2xl mx-auto p-8">
      <p className="mb-4">
        <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to products
        </Link>
      </p>
      <ProductDetail product={product} />
    </main>
  );
}
