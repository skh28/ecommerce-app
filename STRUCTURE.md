# Repository structure

This document defines where code and config live so the repo stays consistent as the app grows.

---

## Root

```
ecommerce-app/
├── prisma/           # Database schema and migrations
├── public/           # Static assets (images, favicon)
├── src/               # Application source (Next.js App Router)
├── .env.example       # Example env vars (copy to .env)
├── .gitignore
├── next.config.js
├── package.json
├── README.md          # Getting started, commands
├── STEPS.md           # Step-by-step build guide
├── STRUCTURE.md       # This file
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.js
```

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

| Path | Method | Purpose |
|------|--------|---------|
| `api/auth/[...nextauth]/route.ts` | * | NextAuth handler (Step 2). |
| `api/cart/route.ts` | GET, POST | Get or add cart items (Step 3). |
| `api/checkout/route.ts` | POST | Create order, clear cart (Step 4). |

**Convention:** One logical resource per folder; use `route.ts` for the HTTP handler.

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
| `lib/auth.ts` | (Step 2) NextAuth config and helpers (e.g. `getServerSession`). |
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
| Routes & pages | `src/app/**/page.tsx` | What users see at each URL. |
| API | `src/app/api/**/route.ts` | Backend endpoints. |
| UI components | `src/components/` | Reusable React components. |
| DB & auth helpers | `src/lib/` | Prisma, NextAuth, formatters. |
| Data model | `prisma/schema.prisma` | Schema and migrations. |

Keeping this structure consistent makes it easier to find code and add features (e.g. new pages under `app/`, new APIs under `app/api/`, new components under `components/`).
