"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CartItemDto } from "@/lib/api-types";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function CheckoutForm() {
  const router = useRouter();
  const [cart, setCart] = useState<{ items: CartItemDto[]; totalCents: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => {
        if (res.status === 401) {
          window.location.href = `/login?callbackUrl=${encodeURIComponent("/checkout")}`;
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((data) => {
        setCart(data ?? { items: [], totalCents: 0 });
        setLoading(false);
      })
      .catch(() => {
        setCart({ items: [], totalCents: 0 });
        setLoading(false);
      });
  }, []);

  async function handlePlaceOrder() {
    if (!cart || cart.items.length === 0) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Checkout failed.");
        setSubmitting(false);
        return;
      }
      router.push("/orders?placed=1");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-gray-500">Loading…</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <Link href="/cart" className="text-blue-600 hover:text-blue-700 font-medium">
          View cart
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
        {cart.items.map((item) => (
          <li key={item.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">{item.productName}</p>
              <p className="text-sm text-gray-500">
                {formatPrice(item.priceCents)} × {item.quantity}
              </p>
            </div>
            <p className="font-medium text-gray-900">
              {formatPrice(item.priceCents * item.quantity)}
            </p>
          </li>
        ))}
      </ul>
      <div className="flex justify-end text-lg">
        <span className="text-gray-600">Total: </span>
        <span className="font-semibold text-gray-900 ml-2">
          {formatPrice(cart.totalCents)}
        </span>
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
      )}
      <div className="flex gap-4">
        <Link
          href="/cart"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
        >
          Back to cart
        </Link>
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:pointer-events-none"
        >
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </div>
    </div>
  );
}
