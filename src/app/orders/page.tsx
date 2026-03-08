import Link from "next/link";
import { OrdersContent } from "@/components/orders-content";

type Props = { searchParams: Promise<{ placed?: string }> };

export default async function OrdersPage({ searchParams }: Props) {
  const { placed } = await searchParams;
  const showPlacedMessage = placed === "1";

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Your orders</h1>
      {showPlacedMessage && (
        <p className="mb-6 text-green-700 bg-green-50 px-4 py-3 rounded-md">
          Order placed successfully. Thank you for your order.
        </p>
      )}
      <OrdersContent />
      <p className="mt-6">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to home
        </Link>
      </p>
    </main>
  );
}
