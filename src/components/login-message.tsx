"use client";

import { useSearchParams } from "next/navigation";

export function LoginMessage() {
  const searchParams = useSearchParams();
  const signupSuccess = searchParams.get("signup") === "success";

  if (!signupSuccess) return null;

  return (
    <p className="mb-4 text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
      Account created. Log in with your email and password.
    </p>
  );
}
