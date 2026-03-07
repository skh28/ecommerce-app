# API Specification

API-first contract for the ecommerce app. Implementations (route handlers and models) must conform to this spec.

**Base URL:** `http://localhost:3000/api` (development)

**Content type:** `application/json` for request and response bodies unless noted.

**Auth:** Session-based (NextAuth). Endpoints that require auth return `401 Unauthorized` when no valid session.

---

## Conventions

- **IDs:** CUIDs (e.g. `clxx...`). Returned as strings.
- **Money:** Always in cents (integer). Never floats.
- **Dates:** ISO 8601 strings (e.g. `2025-03-05T12:00:00.000Z`).
- **Errors:** JSON body `{ "error": "Message" }`. Optional `{ "error": "...", "code": "SOME_CODE" }` for client handling.

---

## 1. Auth

Login/session is handled by NextAuth at `/api/auth/*`. This section covers only the sign-up endpoint used by the app.

### POST /api/auth/signup

Create a new user. No auth required.

**Request body:**

```json
{
  "email": "user@example.com",
  "password": "secret",
  "name": "Jane Doe"
}
```

| Field     | Type   | Required | Notes                    |
|----------|--------|----------|--------------------------|
| email    | string | yes      | Valid email; must be unique |
| password | string | yes      | Min length 8             |
| name     | string | no       | Display name             |

**Success:** `201 Created`

**Response body:**

```json
{
  "user": {
    "id": "clxx...",
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}
```

**Errors:**

| Status | Condition                | Body example                          |
|--------|--------------------------|----------------------------------------|
| 400    | Validation (missing/invalid) | `{ "error": "Invalid email" }`        |
| 409    | Email already registered | `{ "error": "Email already registered" }` |

---

## 2. Products

Public (no auth required). Read-only.

### GET /api/products

List all products.

**Query (optional):**

| Param   | Type   | Notes        |
|--------|--------|--------------|
| limit  | number | Default 50   |
| offset | number | Default 0    |

**Success:** `200 OK`

**Response body:**

```json
{
  "products": [
    {
      "id": "clxx...",
      "name": "Widget",
      "description": "A useful widget.",
      "priceCents": 1999,
      "imageUrl": "https://..."
    }
  ],
  "total": 42
}
```

### GET /api/products/[id]

Single product by ID.

**Success:** `200 OK`

**Response body:** Same shape as one element of `products` above (single object, not array).

**Errors:**

| Status | Condition   | Body example              |
|--------|-------------|---------------------------|
| 404    | Not found   | `{ "error": "Product not found" }` |

---

## 3. Cart

All cart endpoints require an authenticated user (`401` if not logged in). Cart is per user.

### GET /api/cart

Return the current user’s cart.

**Success:** `200 OK`

**Response body:**

```json
{
  "items": [
    {
      "id": "clxx...",
      "productId": "clxx...",
      "productName": "Widget",
      "priceCents": 1999,
      "quantity": 2,
      "imageUrl": "https://..."
    }
  ],
  "totalCents": 3998
}
```

### POST /api/cart

Add a product to the cart or increase quantity if already present.

**Request body:**

```json
{
  "productId": "clxx...",
  "quantity": 1
}
```

| Field     | Type   | Required | Notes              |
|----------|--------|----------|--------------------|
| productId | string | yes      | Must be valid product ID |
| quantity | number | no       | Default 1; positive integer |

**Success:** `200 OK` or `201 Created`

**Response body:** Same as `GET /api/cart` (full cart).

**Errors:**

| Status | Condition        | Body example                |
|--------|------------------|-----------------------------|
| 400    | Invalid body     | `{ "error": "Invalid productId" }` |
| 404    | Product not found | `{ "error": "Product not found" }` |

### PATCH /api/cart/items/[itemId]

Update quantity for one cart line. `itemId` is the cart item ID (not product ID).

**Request body:**

```json
{
  "quantity": 3
}
```

| Field    | Type   | Required | Notes                    |
|----------|--------|----------|--------------------------|
| quantity | number | yes      | Positive integer; 0 = remove |

**Success:** `200 OK`. Response body: same as `GET /api/cart`.

**Errors:**

| Status | Condition              | Body example                  |
|--------|------------------------|-------------------------------|
| 404    | Cart item not found    | `{ "error": "Cart item not found" }` |

### DELETE /api/cart/items/[itemId]

Remove one item from the cart.

**Success:** `200 OK`. Response body: same as `GET /api/cart`.

**Errors:**

| Status | Condition           | Body example                  |
|--------|---------------------|-------------------------------|
| 404    | Cart item not found | `{ "error": "Cart item not found" }` |

---

## 4. Checkout

Creates an order from the current cart and clears the cart.

### POST /api/checkout

Requires auth.

**Request body:** None (or empty `{}`).

**Success:** `201 Created`

**Response body:**

```json
{
  "order": {
    "id": "clxx...",
    "totalCents": 5997,
    "createdAt": "2025-03-05T12:00:00.000Z",
    "items": [
      {
        "productId": "clxx...",
        "productName": "Widget",
        "quantity": 2,
        "priceCents": 1999
      }
    ]
  }
}
```

**Errors:**

| Status | Condition   | Body example                |
|--------|-------------|-----------------------------|
| 400    | Cart empty  | `{ "error": "Cart is empty" }` |

---

## 5. Orders

Read-only. All require auth. Users see only their own orders.

### GET /api/orders

List orders for the current user. Newest first.

**Query (optional):**

| Param  | Type   | Notes      |
|--------|--------|------------|
| limit  | number | Default 20 |
| offset | number | Default 0  |

**Success:** `200 OK`

**Response body:**

```json
{
  "orders": [
    {
      "id": "clxx...",
      "totalCents": 5997,
      "createdAt": "2025-03-05T12:00:00.000Z",
      "itemCount": 3
    }
  ],
  "total": 5
}
```

### GET /api/orders/[id]

Single order with line items. Must belong to the current user.

**Success:** `200 OK`

**Response body:**

```json
{
  "id": "clxx...",
  "totalCents": 5997,
  "createdAt": "2025-03-05T12:00:00.000Z",
  "items": [
    {
      "productId": "clxx...",
      "productName": "Widget",
      "quantity": 2,
      "priceCents": 1999
    }
  ]
}
```

**Errors:**

| Status | Condition      | Body example            |
|--------|----------------|-------------------------|
| 404    | Not found      | `{ "error": "Order not found" }` |

---

## Summary table

| Method | Path                      | Auth | Purpose              |
|--------|---------------------------|------|----------------------|
| POST   | /api/auth/signup          | no   | Register user        |
| GET    | /api/products             | no   | List products        |
| GET    | /api/products/[id]        | no   | Get product          |
| GET    | /api/cart                 | yes  | Get my cart          |
| POST   | /api/cart                 | yes  | Add to cart          |
| PATCH  | /api/cart/items/[itemId]  | yes  | Update cart item     |
| DELETE | /api/cart/items/[itemId]  | yes  | Remove cart item     |
| POST   | /api/checkout             | yes  | Create order         |
| GET    | /api/orders               | yes  | List my orders       |
| GET    | /api/orders/[id]          | yes  | Get order detail     |

NextAuth handles: `GET/POST /api/auth/signin`, `GET/POST /api/auth/callback/*`, `GET /api/auth/session`, `POST /api/auth/signout`.
