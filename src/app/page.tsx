import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Ecommerce App
      </h1>
      <p className="text-gray-600 mb-6">
        Step 1 complete: project setup with Next.js, Prisma (SQLite), and NextAuth.
      </p>
      <nav className="flex gap-4 justify-center">
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Log in
        </Link>
        <Link
          href="/products"
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Products
        </Link>
      </nav>
    </main>
  );
}
