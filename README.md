# Ecommerce App

Small ecommerce app: **login → view products → add to cart → checkout → order history**.

- **docs/API.md** — API specification (contract first; then models/implementation).
- **STRUCTURE.md** — Repository layout and API-first workflow.
- **STEPS.md** — Step-by-step build guide (Steps 1–5).

## Step 1 – Get running

1. **Install Node 18+** (if needed). If `npx create-next-app` failed earlier due to a missing system library, fix that (e.g. update Node via [nvm](https://github.com/nvm-sh/nvm) or Homebrew) so these commands work.

2. **Install dependencies**
   ```bash
   cd /Users/scottha/Projects/ecommerce-app
   npm install
   ```

3. **Environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `NEXTAUTH_SECRET` (e.g. run `openssl rand -base64 32` and paste the result).

4. **Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   This creates the SQLite file `prisma/dev.db` and the tables from `prisma/schema.prisma`.

5. **Run the app**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Useful commands

| Command | What it does |
|--------|----------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npx prisma studio` | Open DB in browser |
| `npx prisma db push` | Apply schema to DB (no migrations) |

## Create the repo (one-time)

From the project root, run:

```bash
cd /Users/scottha/Projects/ecommerce-app
git init
git add .
git commit -m "Initial commit: Next.js + Prisma + NextAuth structure"
```

To push to GitHub/GitLab later: add a remote and push (e.g. `git remote add origin <url>` then `git push -u origin main`).

---

## Next

When you’re ready, say **“Do Step 2”** and we’ll add login and sign-up.
