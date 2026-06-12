import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { createSlug } from '~/server/utils/slug'

const payloadSchema = z.object({
  name: z.string().trim().min(2),
  brand: z.string().trim().min(1).optional().or(z.literal('')),
  categorySlug: z.string().trim().min(1).optional().or(z.literal('')),
  shortDescription: z.string().trim().min(1).optional().or(z.literal('')),
  fullDescription: z.string().trim().optional().or(z.literal('')),
  photoUrl: z.string().trim().url().optional().or(z.literal('')),
  specifications: z.record(z.string()).default({}),
  price: z.string().trim().min(1).optional().or(z.literal('')),
  currency: z.string().trim().min(1).default('IDR'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().optional().default(false),
})

function inferMimeType(url: string) {
  const lower = url.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  return 'image/jpeg'
}

export default defineEventHandler(async (event) => {
  const body = payloadSchema.parse(await readValidatedBody(event, (value) => value))

  const category = body.categorySlug
    ? await prisma.category.findFirst({
        where: { slug: body.categorySlug, type: 'PRODUCT' },
        select: { id: true },
      })
    : null

  const slug = createSlug(body.name)

  try {
    const product = await prisma.$transaction(async (tx) => {
      const primaryImage = body.photoUrl
        ? await tx.media.create({
            data: {
              filename: `${slug}-primary`,
              url: body.photoUrl,
              mimeType: inferMimeType(body.photoUrl),
              sizeBytes: 0,
              altText: body.name,
            },
            select: { id: true },
          })
        : null

      return tx.product.create({
        data: {
          name: body.name,
          slug,
          brand: body.brand || null,
          categoryId: category?.id,
          shortDescription: body.shortDescription || null,
          fullDescription: body.fullDescription || null,
          specifications: body.specifications,
          price: body.price ? new Prisma.Decimal(body.price) : null,
          currency: body.currency || 'IDR',
          primaryImageId: primaryImage?.id,
          status: body.status,
          isFeatured: body.isFeatured,
          publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
        },
        select: { slug: true },
      })
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