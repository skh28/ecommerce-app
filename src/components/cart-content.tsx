"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { CartItemDto } from "@/lib/api-types";
import { dispatchCartUpdated } from "./cart-link";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function CartContent() {
  const [cart, setCart] = useState<{ items: CartItemDto[]; totalCents: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCart() {
    setError(null);
    const res = await fetch("/api/cart");
    if (res.status === 401) {
      window.location.href = `/login?callbackUrl=${encodeURIComponent("/cart")}`;
      return;
    }
    if (!res.ok) {
      setError("Could not load cart.");
      setCart({ items: [], totalCents: 0 });
      setLoading(false);
      return;
    }
    const data = await res.json();
    setCart(data);
    setLoading(false);
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateQuantity(itemId: string, quantity: number) {
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      const data = await res.json();
      setCart(data);
      dispatchCartUpdated();
    }
  }

  async function removeItem(itemId: string) {
    const res = await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
    if (res.ok) {
      const data = await res.json();
      setCart(data);
      dispatchCartUpdated();
    }
  }

  if (loading) {
    return <p className="text-gray-500">Loading cart…</p>;
  }

  if (error) {
    return (
      <p className="text-red-600 bg-red-50 px-3 py-2 rounded">
        {error}
      </p>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link
          href="/products"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
        {cart.items.map((item) => (
          <li key={item.id} className="p-4 flex gap-4 items-center">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-16 h-16 object-cover rounded bg-gray-100 flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                No image
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.productId}`}
                className="font-medium text-gray-900 hover:text-blue-600 truncate block"
              >
                {item.productName}
              </Link>
              <p className="text-sm text-gray-500">{formatPrice(item.priceCents)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor={`qty-${item.id}`} className="sr-only">
                Quantity for {item.productName}
              </label>
              <select
                id={`qty-${item.id}`}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-900"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-sm text-red-600 hover:text-red-700"
                aria-label={`Remove ${item.productName} from cart`}
              >
                Remove
              </button>
            </div>
            <p className="font-medium text-gray-900 w-20 text-right">
              {formatPrice(item.priceCents * item.quantity)}
            </p>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center border-t border-gray-200 pt-4">
        <Link
          href="/products"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Continue shopping
        </Link>
        <div className="text-right">
          <span className="text-gray-600">Total: </span>
          <span className="text-lg font-semibold text-gray-900">
            {formatPrice(cart.totalCents)}
          </span>
        </div>
      </div>
      <div className="flex justify-end">
        <Link
          href="/checkout"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
