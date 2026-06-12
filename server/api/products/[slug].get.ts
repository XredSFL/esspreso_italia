// Single published product by slug, with category, primary image and gallery.
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug produk wajib diisi' })
  }

  const product = await prisma.product.findFirst({
    where: { slug, status: 'PUBLISHED' },
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      brand: true,
      shortDescription: true,
      fullDescription: true,
      specifications: true,
      price: true,
      currency: true,
      publishedAt: true,
      category: { select: { name: true, slug: true } },
      primaryImage: { select: { url: true, altText: true } },
      images: {
        orderBy: { sortOrder: 'asc' },
        select: { media: { select: { url: true, altText: true } } },
      },
    },
  })

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
  }

  return product
})
