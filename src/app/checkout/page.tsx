import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";

export default function CheckoutPage() {
  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Checkout</h1>
      <CheckoutForm />
      <p className="mt-6">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to home
        </Link>
      </p>
    </main>
  );
}
