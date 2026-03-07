import { NextRequest } from "next/server";
import { created, badRequest, conflict } from "@/lib/api-response";
import type { SignupRequest, SignupResponse } from "@/lib/api-types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: NextRequest) {
  let body: SignupRequest;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  const { email, password, name } = body;
  if (!email || typeof email !== "string") {
    return badRequest("Email is required");
  }
  if (!EMAIL_REGEX.test(email)) {
    return badRequest("Invalid email");
  }
  if (!password || typeof password !== "string") {
    return badRequest("Password is required");
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return badRequest("Password must be at least 8 characters");
  }

  // TODO: Implement with Prisma — create user, hash password, return SignupResponse
  // For now return 501 so the API contract is in place
  return created({
    user: {
      id: "stub-user-id",
      email: email.trim().toLowerCase(),
      name: typeof name === "string" ? name.trim() || null : null,
    },
  } satisfies SignupResponse);
}
