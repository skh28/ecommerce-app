"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { OrderSummaryDto } from "@/lib/api-types";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function OrdersContent() {
  const [orders, setOrders] = useState<OrderSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => {
        if (res.status === 401) {
          window.location.href = `/login?callbackUrl=${encodeURIComponent("/orders")}`;
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((data: { orders?: OrderSummaryDto[] } | null) => {
        setOrders(data?.orders ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading orders…</p>;

  if (orders.length === 0) {
    return (
      <p className="text-gray-500">
        You haven&apos;t placed any orders yet.{" "}
        <Link href="/products" className="text-blue-600 hover:text-blue-700">
          Browse products
        </Link>
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
      {orders.map((order) => (
        <li key={order.id} className="p-4 flex justify-between items-center">
          <div>
            <Link
              href={`/orders/${order.id}`}
              className="font-medium text-gray-900 hover:text-blue-600"
            >
              Order {order.id.slice(0, 8)}…
            </Link>
            <p className="text-sm text-gray-500">
              {formatDate(order.createdAt)} · {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
            </p>
          </div>
          <p className="font-medium text-gray-900">{formatPrice(order.totalCents)}</p>
        </li>
      ))}
    </ul>
  );
}
