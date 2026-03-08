"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function CartLink() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cart")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.items) {
          const total = data.items.reduce((sum: number, i: { quantity: number }) => sum + i.quantity, 0);
          setCount(total);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <Link
      href="/cart"
      className="text-gray-600 hover:text-gray-900 text-sm font-medium"
    >
      Cart{count !== null && count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
