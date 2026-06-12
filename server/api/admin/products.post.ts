import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { createSlug } from '~/server/utils/slug'

const payloadSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2).optional(),
  sku: z.string().trim().min(1).optional().or(z.literal('')),
  brand: z.string().trim().min(1).optional().or(z.literal('')),
  categorySlug: z.string().trim().min(1).optional().or(z.literal('')),
  shortDescription: z.string().trim().min(1).optional().or(z.literal('')),
  fullDescription: z.string().trim().optional().or(z.literal('')),
  specificationsText: z.string().trim().optional().or(z.literal('')),
  price: z.string().trim().min(1).optional().or(z.literal('')),
  currency: z.string().trim().min(1).default('IDR'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().optional().default(false),
})

export default defineEventHandler(async (event) => {
  const body = payloadSchema.parse(await readValidatedBody(event, (value) => value))

  const category = body.categorySlug
    ? await prisma.category.findFirst({
        where: { slug: body.categorySlug, type: 'PRODUCT' },
        select: { id: true },
      })
    : null

  const slug = body.slug || createSlug(body.name)
  let specifications: Record<string, unknown> = {}

  if (body.specificationsText) {
    try {
      const parsed = JSON.parse(body.specificationsText)
      specifications = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format specifications JSON tidak valid',
      })
    }
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        sku: body.sku || null,
        brand: body.brand || null,
        categoryId: category?.id,
        shortDescription: body.shortDescription || null,
        fullDescription: body.fullDescription || null,
        specifications,
        price: body.price ? new Prisma.Decimal(body.price) : null,
        currency: body.currency || 'IDR',
        status: body.status,
        isFeatured: body.isFeatured,
        publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
      },
      select: { slug: true },
    })

    return product
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Slug produk sudah dipakai, ganti slug atau nama produk.',
      })
    }

    throw error
  }
})