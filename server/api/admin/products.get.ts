import { z } from 'zod'

const querySchema = z.object({
  q: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
})

export default defineEventHandler(async (event) => {
  const { q, category, status, limit } = querySchema.parse(getQuery(event))

  return prisma.product.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(category ? { category: { is: { slug: category, type: 'PRODUCT' } } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { sku: { contains: q, mode: 'insensitive' } },
              { brand: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    select: {
      id: true,
      sku: true,
      name: true,
      slug: true,
      brand: true,
      status: true,
      isFeatured: true,
      publishedAt: true,
      updatedAt: true,
      category: { select: { name: true, slug: true } },
      primaryImage: { select: { url: true, altText: true } },
    },
  })
})