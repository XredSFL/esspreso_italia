import { z } from 'zod'

const querySchema = z.object({
  type: z.enum(['PRODUCT', 'NEWS', 'CLASS']).default('PRODUCT'),
})

// Categories of a given type, ordered for use in filters/menus.
export default defineEventHandler(async (event) => {
  const { type } = querySchema.parse(getQuery(event))
  return prisma.category.findMany({
    where: { type },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, slug: true },
  })
})
