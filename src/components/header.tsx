"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { CartLink } from "./cart-link";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900 hover:text-gray-700">
          Ecommerce App
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Products
          </Link>
          {status === "loading" ? (
            <span className="text-sm text-gray-400">...</span>
          ) : session?.user ? (
            <>
              <CartLink />
              <Link
                href="/orders"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Orders
              </Link>
              <span className="text-sm text-gray-600 truncate max-w-[140px]">
                {session.user.email}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
