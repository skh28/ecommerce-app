"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import type { ProductDto } from "@/lib/api-types";
import { AddToCartButton } from "./add-to-cart-button";

type Props = { products: ProductDto[]; searchQuery?: string };

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function ProductGrid({ products, searchQuery }: Props) {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  if (products.length === 0) {
    return (
      <p className="text-gray-500 text-center py-12">
        {searchQuery
          ? "No products match your search. Try a different term or clear the search."
          : "No products yet. Run "}
        {!searchQuery && (
          <code className="bg-gray-100 px-1 rounded">npm run db:seed</code>
        )}
        {!searchQuery && " to add sample products."}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <li
          key={product.id}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <Link href={`/products/${product.id}`} className="block">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover bg-gray-100"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                No image
              </div>
            )}
            <div className="p-4">
              <h2 className="font-semibold text-gray-900 truncate">{product.name}</h2>
              {product.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
                  {product.description}
                </p>
              )}
              <p className="mt-2 font-medium text-gray-900">{formatPrice(product.priceCents)}</p>
            </div>
          </Link>
          <div className="px-4 pb-4">
            {isLoggedIn ? (
              <AddToCartButton productId={product.id} productName={product.name} />
            ) : (
              <Link
                href={`/login?callbackUrl=${encodeURIComponent("/products")}`}
                className="block w-full text-center py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50"
              >
                Log in to add to cart
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
