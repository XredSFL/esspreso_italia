import { Prisma } from '@prisma/client'
import { z } from 'zod'

const payloadSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2).optional(),
  sku: z.string().trim().min(1).optional().or(z.literal('')),
  brand: z.string().trim().min(1).optional().or(z.literal('')),
  categorySlug: z.string().trim().min(1).optional().or(z.literal('')),
  shortDescription: z.string().trim().optional().or(z.literal('')),
  fullDescription: z.string().trim().optional().or(z.literal('')),
  specificationsText: z.string().trim().optional().or(z.literal('')),
  price: z.string().trim().min(1).optional().or(z.literal('')),
  currency: z.string().trim().min(1).default('IDR'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().optional().default(false),
})

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug produk wajib diisi' })
  }

  const body = payloadSchema.parse(await readValidatedBody(event, (value) => value))
  const category = body.categorySlug
    ? await prisma.category.findFirst({
        where: { slug: body.categorySlug, type: 'PRODUCT' },
        select: { id: true },
      })
    : null

  const updated = await prisma.product.update({
    where: { slug },
    data: {
      name: body.name,
      slug: body.slug || createSlug(body.name),
      sku: body.sku || null,
      brand: body.brand || null,
      categoryId: category?.id,
      shortDescription: body.shortDescription || null,
      fullDescription: body.fullDescription || null,
      specifications: body.specificationsText ? JSON.parse(body.specificationsText) : {},
      price: body.price ? new Prisma.Decimal(body.price) : null,
      currency: body.currency || 'IDR',
      status: body.status,
      isFeatured: body.isFeatured,
      publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
    },
    select: { slug: true },
  })

  return updated
})