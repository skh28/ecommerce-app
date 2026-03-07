import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { LoginMessage } from "@/components/login-message";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Log in</h1>
      <Suspense fallback={<p className="text-gray-600">Loading…</p>}>
        <LoginMessage />
        <LoginForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-gray-500">
        <Link href="/" className="text-gray-600 hover:text-gray-900">
          ← Back to home
        </Link>
      </p>
    </main>
  );
}
