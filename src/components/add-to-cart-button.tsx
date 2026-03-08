"use client";

import { useState } from "react";

type Props = { productId: string; productName: string };

export function AddToCartButton({ productId, productName }: Props) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleClick() {
    setLoading(true);
    setAdded(false);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.status === 401) {
        window.location.href = `/login?callbackUrl=${encodeURIComponent("/products")}`;
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error ?? "Could not add to cart");
        return;
      }
      setAdded(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
      aria-label={`Add ${productName} to cart`}
    >
      {loading ? "Adding…" : added ? "Added" : "Add to cart"}
    </button>
  );
}
