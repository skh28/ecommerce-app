import Link from "next/link";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Create an account</h1>
      <SignupForm />
      <p className="mt-6 text-center text-sm text-gray-500">
        <Link href="/" className="text-gray-600 hover:text-gray-900">
          ← Back to home
        </Link>
      </p>
    </main>
  );
}
