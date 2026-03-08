import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();
  const isLoggedIn = !!session?.user;

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl mb-4">
          {isLoggedIn ? (
            <>
              Welcome back{session.user.name ? `, ${session.user.name}` : ""}
            </>
          ) : (
            "Shop simple."
          )}
        </h1>
        <p className="text-lg text-gray-600 max-w-md mb-10">
          {isLoggedIn
            ? "Browse products, manage your cart, and view your orders."
            : "Create an account or sign in to add to cart and checkout."}
        </p>

        {isLoggedIn ? (
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Browse products
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              View cart
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              My orders
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center px-5 py-2.5 text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors"
            >
              Browse without account →
            </Link>
          </div>
        )}
      </section>

      <section className="border-t border-gray-200 bg-white/50 px-6 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            How it works
          </h2>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-1 text-sm text-gray-600">
            <li>Create an account</li>
            <li>Add items to cart</li>
            <li>Check out</li>
            <li>Track orders</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
