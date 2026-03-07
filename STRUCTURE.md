# Repository structure

This document defines where code and config live so the repo stays consistent as the app grows.

---

## Root

```
ecommerce-app/
├── docs/              # API and design docs (API-first)
│   └── API.md         # API specification (contract for all endpoints)
├── prisma/            # Database schema and migrations
├── public/            # Static assets (images, favicon)
├── src/               # Application source (Next.js App Router)
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── README.md
├── STEPS.md
├── STRUCTURE.md       # This file
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.js
```

---

## API-first workflow

1. **Contract** — Define endpoints, request/response shapes, and errors in **docs/API.md**.
2. **Types** — Add TypeScript DTOs in **src/lib/api-types.ts** (single source of truth for the API layer).
3. **Routes** — Implement route handlers under **src/app/api/** that use those types and return the documented responses. Use **src/lib/api-response.ts** for consistent status codes and error bodies.
4. **Models / implementation** — Wire route handlers to Prisma (and other services) so they fulfill the contract.

Route handlers may start as stubs (e.g. return empty lists or 401) and be filled in once the data layer is ready.

---

## `docs/`

| Path | Purpose |
|------|--------|
| `API.md` | Full API specification: methods, paths, request/response bodies, status codes, errors. Implementations must conform. |

---

## `prisma/`

| Path | Purpose |
|------|--------|
| `schema.prisma` | Data models (User, Product, CartItem, Order, OrderItem). Single source of truth for the DB. |
| `seed.ts` | (Step 3) Script to insert sample products. Run with `npm run db:seed`. |
| `dev.db` | SQLite database file (gitignored). Created by `prisma db push`. |

**Convention:** All DB access goes through `@prisma/client`; use the shared client in `src/lib/prisma.ts`.

---

## `src/`

### `src/app/` — Next.js App Router (routes + UI)

Each folder under `app/` is a route segment. File names have special meaning:

| Path | Route | Purpose |
|------|--------|---------|
| `app/layout.tsx` | (root) | Root layout (html, body, global nav). |
| `app/page.tsx` | `/` | Home page. |
| `app/globals.css` | — | Global styles (Tailwind). |
| `app/login/page.tsx` | `/login` | Login (and later sign-up) UI. |
| `app/products/page.tsx` | `/products` | Product listing. |
| `app/cart/page.tsx` | (Step 4) `/cart` | Cart and checkout. |
| `app/orders/page.tsx` | (Step 5) `/orders` | Order history. |
| `app/api/` | `/api/*` | API route handlers (auth, cart, checkout). |

**Convention:** Page components are the default export of `page.tsx`. Use Server Components by default; add `"use client"` only when you need state or browser APIs.

### `src/app/api/` — API routes

All endpoints are specified in **docs/API.md**. Handlers use **src/lib/api-types.ts** and **src/lib/api-response.ts**.

| Path | Methods | Purpose |
|------|--------|---------|
| `api/auth/signup/route.ts` | POST | Register user. |
| `api/auth/[...nextauth]/route.ts` | * | NextAuth (signin, callback, session, signout). |
| `api/products/route.ts` | GET | List products. |
| `api/products/[id]/route.ts` | GET | Get product by ID. |
| `api/cart/route.ts` | GET, POST | Get cart; add to cart. |
| `api/cart/items/[itemId]/route.ts` | PATCH, DELETE | Update or remove cart item. |
| `api/checkout/route.ts` | POST | Create order from cart. |
| `api/orders/route.ts` | GET | List my orders. |
| `api/orders/[id]/route.ts` | GET | Get order detail. |

**Convention:** One logical resource per folder; use `route.ts` for the HTTP handler. Auth-protected routes use `getSession()` from `src/lib/auth.ts`.

### `src/components/` — Reusable UI

| Path | Purpose |
|------|--------|
| `components/Header.tsx` | Site header (nav, login state, cart count). |
| `components/ProductCard.tsx` | Product card with “Add to cart” (Step 3). |
| (others as needed) | Buttons, forms, layout pieces. |

**Convention:** One component per file; prefer small, focused components.

### `src/lib/` — Shared logic (no UI)

| Path | Purpose |
|------|--------|
| `lib/prisma.ts` | Single Prisma client instance. |
| `lib/auth.ts` | Session helper for API routes (`getSession()`). Replace with NextAuth `getServerSession` when auth is implemented. |
| `lib/api-types.ts` | Request/response DTOs for the API (aligned with docs/API.md). |
| `lib/api-response.ts` | Helpers for JSON responses and error responses (status + body). |
| `lib/format.ts` | (optional) Helpers like `formatPrice(cents)`. |

**Convention:** No React components here; only utilities, config, and shared types.

---

## Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Prisma DB URL. Use `file:./dev.db` for SQLite. |
| `NEXTAUTH_SECRET` | Yes | Secret for signing sessions. Use `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | Yes (dev) | App URL, e.g. `http://localhost:3000`. |

Copy `.env.example` to `.env` and fill in values. Never commit `.env`.

---

## What we don’t put in the repo

- `node_modules/` — installed via `npm install`
- `.next/` — build output
- `.env` — local secrets
- `prisma/*.db` — local SQLite file(s)
- IDE/editor project files (e.g. `.idea`, `.vscode`) — optional in `.gitignore` if you prefer to share them

---

## Summary

| Layer | Location | Role |
|-------|----------|------|
| API contract | `docs/API.md` | Specification first; implementations follow. |
| API types | `src/lib/api-types.ts` | Request/response DTOs. |
| API routes | `src/app/api/**/route.ts` | Backend endpoints. |
| Pages | `src/app/**/page.tsx` | What users see at each URL. |
| UI components | `src/components/` | Reusable React components. |
| DB & auth | `src/lib/` | Prisma, auth, api-response, formatters. |
| Data model | `prisma/schema.prisma` | Schema and migrations. |

Keeping this structure consistent makes it easier to find code and add features (e.g. new pages under `app/`, new APIs under `app/api/`, new components under `components/`).
