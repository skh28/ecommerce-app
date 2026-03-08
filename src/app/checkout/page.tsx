import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Checkout</h1>
      <p className="text-gray-600 mb-6">
        Checkout will be implemented in the next step. For now, return to your cart or home.
      </p>
      <div className="flex gap-4">
        <Link
          href="/cart"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to cart
        </Link>
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
