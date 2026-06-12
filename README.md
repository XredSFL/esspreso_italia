# Espresso Italia — Website + CMS (Prototype)

Prototype rebuild of [espressoitalia.id](https://espressoitalia.id) on a modern stack with a
self-service CMS. **Nuxt 3 + TypeScript + Tailwind + Prisma (Prisma Postgres)**, deployable to
**Vercel**. UI language: **Bahasa Indonesia**. See [`CLAUDE.md`](./CLAUDE.md) for full spec.

> Status: **foundation + data model**. Project scaffold, Tailwind design tokens, Prisma wiring,
> the full data model (CLAUDE.md §4), initial migration, and a seed with sample content are in
> place. Public pages and the admin CMS come in the next milestones.

## Tech stack

- **Nuxt 3** (Vue 3, SSR) + **TypeScript** (strict)
- **Tailwind CSS** via `@nuxtjs/tailwindcss` — design tokens in `tailwind.config.ts`
- **Prisma ORM** with `provider = "postgresql"` (Prisma Postgres)
- **Vercel** hosting (Nitro auto-selects the `vercel` preset — no manual config)

## Local setup

Requirements: Node 18+ and pnpm.

```bash
pnpm install            # installs deps; postinstall runs `prisma generate`
cp .env.example .env    # then fill in the values (see below)
```

### Database (pick one)

**A. Cloud Prisma Postgres (the prototype's real target).** Put your Prisma Postgres
connection string in `DATABASE_URL`, then:

```bash
pnpm prisma:migrate     # apply migrations
pnpm prisma:seed        # load sample data
pnpm dev                # http://localhost:3000
```

**B. Offline local Postgres (no cloud account needed).** A helper runs a real Postgres
locally via `embedded-postgres` (dev-only; `prisma dev` needs Node 22+, so this is the
Node-20-friendly option). The default `.env` already points at it.

```bash
pnpm db:local           # terminal 1 — starts Postgres on :5433, keep it running
pnpm prisma:migrate     # terminal 2
pnpm prisma:seed
pnpm dev
```

### Seeded login (prototype)

| Field    | Value                        |
| -------- | ---------------------------- |
| Email    | `owner@espressoitalia.id`    |
| Password | `password123`                |
| Role     | `OWNER`                      |

### Environment variables (`.env`)

| Key                     | Purpose                                                     |
| ----------------------- | ---------------------------------------------------------- |
| `DATABASE_URL`          | Postgres connection string (cloud Prisma Postgres, or the local `:5433` default) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store token for image/file uploads             |
| `NUXT_SESSION_PASSWORD` | Session cookie secret (min 32 chars)                       |

## Deploy to Vercel

1. Import the repo into Vercel — Nuxt is auto-detected and uses the Nitro `vercel` preset.
2. Add the env vars above in **Project → Settings → Environment Variables**
   (`DATABASE_URL` is set automatically by the Vercel↔Prisma Postgres integration).
3. Build command is `prisma generate && nuxt build` (already in `package.json`).
4. Apply the schema to the cloud DB with `prisma migrate deploy` (once real models exist).

## Project scripts

| Script           | Does                                  |
| ---------------- | ------------------------------------- |
| `pnpm dev`       | Dev server at `localhost:3000`        |
| `pnpm build`     | `prisma generate && nuxt build`       |
| `pnpm preview`   | Preview the production build          |
| `pnpm prisma:*`  | Prisma migrate / deploy / seed / studio |

## What is / isn't built yet

- ✅ Nuxt 3 + TS scaffold, SSR, Vercel-ready
- ✅ Tailwind + coffee-theme design tokens (colors + Playfair Display / Inter fonts)
- ✅ Prisma client singleton (`server/utils/prisma.ts`), `postgresql` provider
- ✅ Full data model (CLAUDE.md §4) + initial migration + seed (8 products, 3 articles,
  1 gelato class w/ sessions, promo/event, home sections, settings, OWNER user)
- ⛔ Public pages (Home, Catalog, Product, Blog) — next
- ⛔ Admin CMS + auth — next
