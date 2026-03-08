"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import type { ProductDto } from "@/lib/api-types";
import { AddToCartButton } from "./add-to-cart-button";

type Props = { product: ProductDto };

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function ProductDetail({ product }: Props) {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover bg-gray-100"
        />
      ) : (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
          No image
        </div>
      )}
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
        <p className="mt-2 text-lg font-medium text-gray-900">{formatPrice(product.priceCents)}</p>
        {product.description && (
          <p className="mt-4 text-gray-600">{product.description}</p>
        )}
        <div className="mt-6">
          {isLoggedIn ? (
            <AddToCartButton productId={product.id} productName={product.name} />
          ) : (
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(`/products/${product.id}`)}`}
              className="inline-block px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              Log in to add to cart
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
