import { PrismaClient } from '@prisma/client'

// Single Prisma client via a globalThis singleton (CLAUDE.md §7).
// Prevents exhausting serverless DB connections during dev hot-reload and on Vercel.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
