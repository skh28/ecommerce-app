"use client";

import type { OrderDetailResponse } from "@/lib/api-types";

type Props = { order: OrderDetailResponse };

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function OrderDetailView({ order }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Order {order.id.slice(0, 8)}…</h1>
        <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
      </div>
      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
        {order.items.map((item) => (
          <li key={`${item.productId}-${item.quantity}`} className="p-4 flex justify-between items-center">
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
          {formatPrice(order.totalCents)}
        </span>
      </div>
    </div>
  );
}
