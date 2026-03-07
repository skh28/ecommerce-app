import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import { created, badRequest, conflict } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
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

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) return conflict("Email already registered");

  const hashedPassword = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      password: hashedPassword,
      name: typeof name === "string" ? name.trim() || null : null,
    },
  });

  return created({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  } satisfies SignupResponse);
}
