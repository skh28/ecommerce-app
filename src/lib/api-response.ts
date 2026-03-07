/**
 * Helpers for consistent API responses. Use in route handlers to match docs/API.md.
 */
import { NextResponse } from "next/server";
import type { ApiErrorResponse } from "./api-types";

const JSON_HEADERS = { "Content-Type": "application/json" };

export function json<T>(data: T, status = 200) {
  return NextResponse.json(data, { status, headers: JSON_HEADERS });
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201, headers: JSON_HEADERS });
}

export function badRequest(error: string, code?: string) {
  const body: ApiErrorResponse = { error, ...(code && { code }) };
  return NextResponse.json(body, { status: 400, headers: JSON_HEADERS });
}

export function unauthorized(error = "Unauthorized") {
  const body: ApiErrorResponse = { error };
  return NextResponse.json(body, { status: 401, headers: JSON_HEADERS });
}

export function notFound(error = "Not found") {
  const body: ApiErrorResponse = { error };
  return NextResponse.json(body, { status: 404, headers: JSON_HEADERS });
}

export function conflict(error: string) {
  const body: ApiErrorResponse = { error };
  return NextResponse.json(body, { status: 409, headers: JSON_HEADERS });
}
