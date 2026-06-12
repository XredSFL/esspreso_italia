import { z } from 'zod'

const querySchema = z.object({
  q: z.string().trim().min(1).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
})

export default defineEventHandler(async (event) => {
  const { q, status, limit } = querySchema.parse(getQuery(event))

  return prisma.article.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { excerpt: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
      category: { select: { name: true, slug: true } },
      coverImage: { select: { url: true, altText: true } },
    },
  })
})