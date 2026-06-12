# CLAUDE.md — Espresso Italia Website + CMS (Prototype, Vercel-ready)

> Project memory for Claude Code. Read at the start of every session.
> Goal: build a **working prototype**, deployable to **Vercel**, to show the business owner /
> client an early picture of the new website + CMS. Favor a clean vertical slice over breadth.

## 1. Business context

PT Espresso Italia is a B2B distributor of coffee machines, gelato machines and HoReCa
kitchen equipment in Indonesia (espressoitalia.id). The current site is static HTML, slow,
and every content change needs a developer. This project rebuilds the site on a modern
stack and adds a CMS so the company can manage content itself.

- **UI language: Indonesian** (all visible labels, buttons, content in Bahasa Indonesia).
- Keep the existing visual identity (warm coffee theme). Design stays; content becomes dynamic.

## 2. Tech stack (do not substitute without asking)

- **Framework:** Nuxt 3 + Vue 3 + TypeScript (SSR for public pages — important for SEO).
- **Hosting:** **Vercel** (Nuxt auto-detects the Nitro `vercel` preset — no manual config needed).
- **API:** Nuxt Nitro server routes under `server/api` (no separate backend).
- **Database:** **Prisma Postgres** (serverless Postgres with built-in connection pooling +
  one-click Vercel integration), accessed via **Prisma ORM** (`provider = "postgresql"`).
  Follow Prisma's official Prisma Postgres + Vercel quickstart for client wiring.
- **Image/file storage:** **Vercel Blob** (`@vercel/blob`). Do NOT write to the local filesystem
  for uploads — Vercel's runtime filesystem is ephemeral and read-only.
- **Styling:** Tailwind CSS using the design tokens in section 5. No other UI kit.
- **Auth (admin):** cookie session via `nuxt-auth-utils`; passwords hashed (bcrypt). Prototype-grade.
- **Rich text:** Tiptap (`@tiptap/vue-3`) for article/product descriptions (WYSIWYG).
- **Validation:** zod for API input. **Package manager:** pnpm (npm acceptable).

> Why not self-hosted MySQL? Vercel only runs app code (serverless), not a database server, so a
> Docker/MySQL container cannot run there. Prisma Postgres is a hosted serverless DB reachable
> from Vercel functions. The production proposal still targets MySQL; the prototype DB engine may
> differ — the Prisma models are portable.

## 3. Project layout

```
/                     Nuxt app root
  pages/              public pages (index, produk, blog, kelas, kontak)
  pages/admin/        CMS dashboard (login, dashboard, produk, artikel, ...)
  components/         shared UI (PascalCase.vue)
  components/admin/   admin-only UI (tables, forms, sidebar)
  layouts/            default.vue (public), admin.vue (dashboard shell)
  server/api/         REST endpoints (e.g. server/api/products/index.get.ts)
  server/utils/       prisma.ts (singleton client), auth helpers, blob helper
  composables/        useXxx() client helpers
  prisma/             schema.prisma, migrations, seed.ts
  assets/css/         tailwind.css + tokens
  .env / .env.example DATABASE_URL, BLOB_READ_WRITE_TOKEN, NUXT_SESSION_PASSWORD (never commit .env)
```

`.env.example` keys:
```
DATABASE_URL="prisma+postgres://...."          # from Prisma Postgres / Vercel integration
# DIRECT_URL="postgres://..."                  # only if your setup needs it for migrations
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_...."    # from Vercel Blob store
NUXT_SESSION_PASSWORD="min-32-char-random-secret"
```

## 4. Data model (Prisma, Postgres)

Implement these models (`provider = "postgresql"`). Use enums where noted; timestamps
`createdAt`/`updatedAt` on content tables. HTML fields use `@db.Text`; flexible data uses `Json`.

- **User**: email (unique), passwordHash, fullName, role `OWNER|ADMIN|EDITOR`, isActive.
- **Media**: filename, url (Vercel Blob URL), mimeType, sizeBytes, width?, height?, altText?.
- **Category**: type `PRODUCT|NEWS|CLASS`, name, slug, sortOrder. Unique (type, slug).
- **Product**: sku?, name, slug (unique), categoryId?, brand?, shortDescription?,
  fullDescription? (HTML), specifications (Json), price? (Decimal), currency (default "IDR"),
  primaryImageId?, status `DRAFT|PUBLISHED|ARCHIVED`, isFeatured, publishedAt?.
- **ProductImage**: productId, mediaId, sortOrder (gallery join).
- **Article**: title, slug (unique), excerpt?, content (HTML), coverImageId?, categoryId?,
  authorId?, status, publishedAt?.
- **GelatoClass**: title, slug, description?, content?, coverImageId?, instructor?, level?,
  price?, status. **ClassSession**: classId, startDatetime, endDatetime?, location?, capacity, status.
- **PromoEvent**: title, slug, type `PROMO|EVENT`, content?, coverImageId?, startDate?, endDate?, status.
- **HomeSection**: key `HERO|BRANDS|CLIENTS|FLYER|FEATURED`, payload (Json), sortOrder, isActive.
- **Setting**: key (unique), value (Json) — promo bar, footer, WhatsApp number, logo.

Seed sample data: ~8 products across the 4 categories (Coffee, Gelato, Kitchen, Other),
3 articles, 1 gelato class with sessions, home sections, settings, and one OWNER user.

## 5. Design tokens (match the approved mockups)

Tailwind theme colors (hex):
- espresso `#2A1A12` · brown `#4A2E1E` · caramel `#C0852D` · caramelDark `#A66F22`
- cream `#F7F1E8` · panel `#F2ECE2` · ink `#33291F` · body `#574A3D`
- muted `#9C8C79` · line `#E4DACB` · success `#3FAE5A` · danger `#A23B23`

Typography: headings = serif (Playfair Display); body = Inter. Rounded corners ~10px,
soft shadows, generous spacing. Public hero/section dividers may use espresso backgrounds;
content areas white/cream. Admin: dark espresso sidebar, white content, caramel primary buttons.

## 6. Prototype scope (build in this order)

Build a **vertical slice**, not every module:
1. Scaffold project, Tailwind tokens, Prisma + Prisma Postgres, schema + migrate + seed,
   Prisma singleton, `prisma generate` in build, Vercel-ready config.
2. **Public site:** Home (hero + featured products + latest articles), Product catalog
   (category filter + search), Product detail, Blog list + Blog detail. Responsive + meta tags.
3. **Admin shell + auth:** `/admin/login`, session guard, dashboard layout with sidebar
   (Produk, Artikel, Promo & Event, Section Beranda, Kelas Gelato, Media, Pengaturan, Pengguna).
4. **Produk module (full CRUD):** list (search, category filter, status pill, add/edit/delete),
   edit form (name, category, brand, descriptions with WYSIWYG, specifications, image upload to
   Vercel Blob → gallery, SEO meta fields, Draft/Publish toggle).
5. **Artikel module (full CRUD):** list + WYSIWYG editor + cover image (Vercel Blob) + status.
6. Other modules: dashboard cards/stubs are fine for the prototype (label "Segera hadir").

## 7. Conventions

- TypeScript strict. Components PascalCase. Composables `useThing()`. API files `*.get.ts`/`*.post.ts`.
- Single Prisma client via a `globalThis` singleton in `server/utils/prisma.ts` (avoids exhausting
  serverless connections).
- Server endpoints validate input with zod and return typed JSON; handle errors gracefully.
- URLs are slug-based and SEO-friendly (`/produk/<slug>`, `/blog/<slug>`). Every public page sets
  `<title>` + meta via `useSeoMeta`.
- All user-facing text in Indonesian. Code identifiers/comments in English.
- Secrets only in `.env` (provide `.env.example`). Never commit secrets or `node_modules`.
- Commit in small, working steps using conventional commits (`feat:`, `fix:`, `chore:`).

## 8. Commands

```bash
pnpm install                 # installs deps; postinstall runs `prisma generate`
pnpm prisma migrate dev      # create/apply migrations (local)
pnpm prisma db seed          # load sample data
pnpm dev                     # dev server (http://localhost:3000, admin at /admin)
pnpm build                   # `prisma generate && nuxt build` (Vercel build)
pnpm preview
pnpm lint
```

Local dev uses the same Prisma Postgres connection string in `DATABASE_URL`
(or `npx prisma dev` for an offline local Prisma Postgres instance).

## 9. Deployment (Vercel) — must stay deployable

- Nuxt auto-selects the Nitro **`vercel`** preset on Vercel; keep SSR (do 
not force static).
- **`prisma generate` must run in the build.** Add `"postinstall": "prisma generate"` and make the
  build `"prisma generate && nuxt build"`. Apply schema to the cloud DB with `prisma migrate deploy`.
- **Env vars on Vercel:** `DATABASE_URL` (Prisma Postgres — set automatically by the Vercel↔Prisma
  Postgres integration), `BLOB_READ_WRITE_TOKEN` (Vercel Blob store), `NUXT_SESSION_PASSWORD`.
- **Connections:** Prisma Postgres pools connections by default; still use the Prisma singleton.
- **Uploads:** use `@vercel/blob` `put()`; store the returned URL in `Media.url`. Never write to disk.
- Provide a one-time seed path (script or admin) so the deployed demo has content.
- Keep the app runnable BOTH locally and on Vercel from the same codebase.

## 10. Constraints & non-goals (prototype)

- **No payment gateway, no real ordering** — out of scope for now.
- **No real product data** — use seeded sample content; the company supplies real content later.
- Keep the public design aligned to the coffee theme above; do not redesign.
- Auth is prototype-grade (not hardened for production).
- SEO migration (301 redirects) documented as TODO, not implemented in the prototype.
- Prototype DB = Prisma Postgres even though the production proposal targets MySQL (models portable).

## 11. Definition of done (prototype)

- Fresh clone runs locally with: `pnpm install` → set `.env` → `pnpm prisma migrate dev` →
  `pnpm prisma db seed` → `pnpm dev`.
- Deploys to Vercel and is reachable at a public URL to share with the client.
- Owner can log into `/admin`, create/edit a product (image upload + WYSIWYG + SEO + Draft/Publish),
  and immediately see it on the public catalog and detail page.
- Home shows featured products + latest articles; blog works; layout is responsive.
- `README.md` documents local setup, Vercel deploy steps, seeded login, and what is/ isn't built.

## 12. Working style

- Before large changes, propose a short plan and wait for confirmation.
- Make one module work end-to-end before starting the next.
- After each milestone, run the app, fix errors, then summarize what changed.
- Ask before adding new dependencies beyond those listed in section 2.