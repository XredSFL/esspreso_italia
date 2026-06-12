// Single published article by slug, with author, category and cover image.
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug artikel wajib diisi' })
  }

  const article = await prisma.article.findFirst({
    where: { slug, status: 'PUBLISHED' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      publishedAt: true,
      category: { select: { name: true, slug: true } },
      author: { select: { fullName: true } },
      coverImage: { select: { url: true, altText: true } },
    },
  })

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
  }

  return article
})
