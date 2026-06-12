# Vercel Prisma Migration Guide

Use this when deploying Espresso Italia to Vercel and you want the Prisma schema to be present in production.

## Required environment variables

- `DATABASE_URL`
- `BLOB_READ_WRITE_TOKEN`
- `NUXT_SESSION_PASSWORD`

## Recommended order

1. Set the production environment variables in Vercel.
2. Deploy the app once so the Vercel project and environment are initialized.
3. Run Prisma migrations against the production database:

```bash
pnpm prisma:deploy
```

4. Seed demo data if needed:

```bash
pnpm prisma:seed
```

## When to use which command

- `pnpm prisma:migrate`: local development only
- `pnpm prisma:deploy`: production / Vercel database
- `pnpm prisma:seed`: demo data only

## Common failure modes

- `500` on admin POST endpoints: often a migration or unique constraint issue.
- `relation does not exist`: production database has not received the Prisma migration yet.
- `P2002`: slug collision, usually from duplicate product or article slugs.