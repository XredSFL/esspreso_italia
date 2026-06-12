// Home page payload: hero section + featured products + latest articles.
export default defineEventHandler(async () => {
  const [hero, featuredProducts, latestArticles] = await Promise.all([
    prisma.homeSection.findUnique({
      where: { key: 'HERO' },
      select: { payload: true, isActive: true },
    }),
    prisma.product.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 6,
      select: {
        id: true,
        name: true,
        slug: true,
        brand: true,
        shortDescription: true,
        price: true,
        currency: true,
        category: { select: { name: true, slug: true } },
        primaryImage: { select: { url: true, altText: true } },
      },
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        category: { select: { name: true, slug: true } },
        coverImage: { select: { url: true, altText: true } },
      },
    }),
  ])

  return {
    hero: hero?.isActive ? hero.payload : null,
    featuredProducts,
    latestArticles,
  }
})
