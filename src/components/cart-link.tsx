"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

const CART_UPDATED_EVENT = "cart-updated";

export function CartLink() {
  const pathname = usePathname();
  const [count, setCount] = useState<number | null>(null);

  const loadCount = useCallback(() => {
    fetch("/api/cart")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.items) {
          const total = data.items.reduce(
            (sum: number, i: { quantity: number }) => sum + i.quantity,
            0
          );
          setCount(total);
        } else {
          setCount(0);
        }
      })
      .catch(() => setCount(0));
  }, []);

  useEffect(() => {
    loadCount();
  }, [loadCount, pathname]);

  useEffect(() => {
    const handler = () => loadCount();
    window.addEventListener(CART_UPDATED_EVENT, handler);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handler);
  }, [loadCount]);

  return (
    <Link
      href="/cart"
      className="text-gray-600 hover:text-gray-900 text-sm font-medium"
    >
      Cart{count !== null && count > 0 ? ` (${count})` : ""}
    </Link>
  );
}

export function dispatchCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  }
}
