import { z } from 'zod'

const querySchema = z.object({
  q: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().positive().max(50).optional(),
})

// Published articles, newest first.
export default defineEventHandler(async (event) => {
  const { q, limit } = querySchema.parse(getQuery(event))

  return prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { excerpt: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      category: { select: { name: true, slug: true } },
      coverImage: { select: { url: true, altText: true } },
    },
  })
})
