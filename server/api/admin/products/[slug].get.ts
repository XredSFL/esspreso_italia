export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug produk wajib diisi' })
  }

  const product = await prisma.product.findFirst({
    where: { slug },
    select: {
      id: true,
      sku: true,
      name: true,
      slug: true,
      brand: true,
      shortDescription: true,
      fullDescription: true,
      specifications: true,
      price: true,
      currency: true,
      status: true,
      isFeatured: true,
      publishedAt: true,
      category: { select: { name: true, slug: true } },
      primaryImage: { select: { url: true, altText: true } },
    },
  })

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
  }

  return product
})