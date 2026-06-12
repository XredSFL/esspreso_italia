import { z } from 'zod'

const articleSchema = z.object({
  title: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  excerpt: z.string().trim().optional().or(z.literal('')),
  content: z.string().trim().min(10),
  categorySlug: z.string().trim().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
})

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug artikel wajib diisi' })
  }

  const body = articleSchema.parse(await readValidatedBody(event, (value) => value))

  const category = body.categorySlug
    ? await prisma.category.findFirst({
        where: { slug: body.categorySlug, type: 'NEWS' },
        select: { id: true },
      })
    : null

  const article = await prisma.article.update({
    where: { slug },
    data: {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content,
      categoryId: category?.id ?? null,
      status: body.status,
      publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
    },
    select: { slug: true },
  })

  return article
})