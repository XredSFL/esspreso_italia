import { z } from 'zod'

const querySchema = z.object({
  q: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(), // category slug
  limit: z.coerce.number().int().positive().max(60).optional(),
})

// Published product catalog with optional category + full-text-ish search.
export default defineEventHandler(async (event) => {
  const { q, category, limit } = querySchema.parse(getQuery(event))

  return prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      ...(category ? { category: { is: { slug: category, type: 'PRODUCT' } } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { brand: { contains: q, mode: 'insensitive' } },
              { shortDescription: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      brand: true,
      shortDescription: true,
      price: true,
      currency: true,
      isFeatured: true,
      category: { select: { name: true, slug: true } },
      primaryImage: { select: { url: true, altText: true } },
    },
  })
})
