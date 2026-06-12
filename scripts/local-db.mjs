// Local offline Postgres for development, powered by `embedded-postgres`.
//
// Why this exists: the prototype's real DB is cloud Prisma Postgres, but for fully offline
// local dev we need a real Postgres. Prisma's own `prisma dev` requires Node 22+ (node:sqlite),
// so this provides a Node-20-friendly alternative that downloads & runs a real Postgres binary.
//
// Usage:
//   pnpm db:local                 # starts Postgres on :5433, keeps running (Ctrl+C to stop)
//   # then, in another terminal, with DATABASE_URL pointing at it (.env default):
//   pnpm prisma:migrate
//   pnpm prisma:seed
//   pnpm dev
import EmbeddedPostgres from 'embedded-postgres'
import { existsSync } from 'node:fs'

const DB_DIR = './.localdb'
const PORT = 5433
const DB_NAME = 'espresso'

const pg = new EmbeddedPostgres({
  databaseDir: DB_DIR,
  user: 'postgres',
  password: 'postgres',
  port: PORT,
  persistent: true,
  authMethod: 'password',
  // Force UTF8 so content (Indonesian text, emoji, …) stores correctly — Windows initdb
  // would otherwise default to WIN1252. `--locale=C` keeps initdb happy with UTF8.
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
})

async function shutdown() {
  console.log('\nStopping local Postgres...')
  try {
    await pg.stop()
  } catch {
    /* ignore */
  }
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

async function main() {
  if (!existsSync(`${DB_DIR}/PG_VERSION`)) {
    console.log(`Initialising local Postgres cluster in ${DB_DIR} ...`)
    await pg.initialise()
  }
  await pg.start()
  console.log(`Local Postgres listening on port ${PORT}`)

  try {
    await pg.createDatabase(DB_NAME)
    console.log(`Database "${DB_NAME}" created`)
  } catch {
    console.log(`Database "${DB_NAME}" already exists`)
  }

  console.log(
    `DATABASE_URL="postgresql://postgres:postgres@localhost:${PORT}/${DB_NAME}?schema=public"`,
  )
  console.log('Local DB ready. Press Ctrl+C to stop.')
}

main().catch((e) => {
  console.error('Local DB failed:', e)
  process.exit(1)
})

// Keep the process alive so Postgres stays up until interrupted.
setInterval(() => {}, 1 << 30)
