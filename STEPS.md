# Ecommerce App – Step-by-Step Guide

Build a small ecommerce app together. Each step adds one piece; you can run the app after any step to see the progress.

---

## Step 1: Project setup
- Create a Next.js app (React + API routes in one project).
- Add Prisma (database toolkit) and SQLite (simple file-based DB, no server needed).
- Add NextAuth.js for login/sessions.
- Define the database schema: **User**, **Product**, **CartItem**, **Order**, **OrderItem**.

**You’ll learn:** Project structure, why we chose these tools, and how the data model supports login → products → cart → checkout → orders.

---

## Step 2: Authentication (login)
- Configure NextAuth with a Credentials provider (email + password).
- Create a simple sign-up flow that stores users in the database.
- Add login and logout and protect routes so only logged-in users can use the app.
- Add a header/nav that shows “Log in” or “Log out” and the user’s name.

**You’ll learn:** Sessions, protected routes, and how login state is available across the app.

---

## Step 3: Product listing and “add to cart”
- Seed the database with a few sample products (name, price, image URL).
- Build a **Products** page that lists all products (cards with image, name, price).
- Add an “Add to cart” button per product that saves the item to the database (linked to the logged-in user).
- Show a cart icon in the header with the current cart item count.

**You’ll learn:** Reading from the DB, linking cart items to the current user, and updating the UI when the cart changes.

---

## Step 4: Cart page and checkout
- Build a **Cart** page that lists the user’s cart items (product, quantity, line total).
- Allow updating quantity or removing an item.
- Add a **Checkout** action that:
  - Creates an **Order** (with total, date, user).
  - Creates **OrderItem** rows from the current cart.
  - Clears the cart.
- Redirect to a “Thank you” or order confirmation page after checkout.

**You’ll learn:** Transforming cart data into an order, writing to the DB, and clearing the cart.

---

## Step 5: Order history
- Build an **Order history** page that lists all orders for the logged-in user (date, total, status if you add it later).
- Each order can expand or link to an **Order detail** view showing the items in that order (product names, quantities, prices).

**You’ll learn:** Querying orders by user and displaying related order items.

---

## Tech stack summary

| Layer      | Choice        | Why                                      |
|-----------|----------------|------------------------------------------|
| Framework | Next.js 14     | Full-stack: pages + API routes, easy deploy |
| Database  | SQLite + Prisma| No separate DB server, simple to run     |
| Auth      | NextAuth.js    | Standard login/session handling in Next.js |
| Styling   | CSS (or Tailwind) | Keeps the app small and easy to follow |

---

## How to use this guide

- **After each step:** run the app, click through the flow, and check the database (e.g. Prisma Studio) to see how data changes.
- **When you’re ready:** say “Next” or “Do Step 2” (or 3, 4, 5) and we’ll implement that step and explain the code.
- **If something is unclear:** ask about that step (e.g. “How does the session work in Step 2?”) and we can go deeper there.

---

## Step 1 – Done

- Next.js app is in `src/app/` (App Router).
- Prisma schema is in `prisma/schema.prisma` (User, Product, CartItem, Order, OrderItem).
- Shared DB client is in `src/lib/prisma.ts`.
- Home page has placeholder links to Login and Products.

**What to do:** Follow the “Step 1 – Get running” section in **README.md**, then run the app and open the home page. When you’re ready, say **“Do Step 2”** to add login and sign-up.
