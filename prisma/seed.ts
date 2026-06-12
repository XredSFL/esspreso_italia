import {
  PrismaClient,
  CategoryType,
  ContentStatus,
  PromoEventType,
  HomeSectionKey,
  Role,
  SessionStatus,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Deterministic placeholder images (replaced by Vercel Blob uploads in the CMS later).
function img(seed: string, w = 800, h = 600) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

function createMedia(seed: string, filename: string, alt: string) {
  return prisma.media.create({
    data: {
      filename,
      url: img(seed),
      mimeType: 'image/jpeg',
      sizeBytes: 120_000,
      width: 800,
      height: 600,
      altText: alt,
    },
  })
}

async function main() {
  console.log('🌱 Seeding Espresso Italia database...')

  // 1. Clean existing data (child → parent order to respect foreign keys).
  await prisma.productImage.deleteMany()
  await prisma.classSession.deleteMany()
  await prisma.product.deleteMany()
  await prisma.article.deleteMany()
  await prisma.gelatoClass.deleteMany()
  await prisma.promoEvent.deleteMany()
  await prisma.homeSection.deleteMany()
  await prisma.setting.deleteMany()
  await prisma.category.deleteMany()
  await prisma.media.deleteMany()
  await prisma.user.deleteMany()

  // 2. Owner user (prototype credentials).
  const passwordHash = await bcrypt.hash('password123', 10)
  const owner = await prisma.user.create({
    data: {
      email: 'owner@espressoitalia.id',
      passwordHash,
      fullName: 'Pemilik Espresso Italia',
      role: Role.OWNER,
      isActive: true,
    },
  })

  // 3. Categories.
  const catCoffee = await prisma.category.create({
    data: { type: CategoryType.PRODUCT, name: 'Mesin Kopi', slug: 'mesin-kopi', sortOrder: 1 },
  })
  const catGelato = await prisma.category.create({
    data: { type: CategoryType.PRODUCT, name: 'Mesin Gelato', slug: 'mesin-gelato', sortOrder: 2 },
  })
  const catKitchen = await prisma.category.create({
    data: { type: CategoryType.PRODUCT, name: 'Peralatan Dapur', slug: 'peralatan-dapur', sortOrder: 3 },
  })
  const catOther = await prisma.category.create({
    data: { type: CategoryType.PRODUCT, name: 'Lainnya', slug: 'lainnya', sortOrder: 4 },
  })
  const catNews = await prisma.category.create({
    data: { type: CategoryType.NEWS, name: 'Berita', slug: 'berita', sortOrder: 1 },
  })
  const catTips = await prisma.category.create({
    data: { type: CategoryType.NEWS, name: 'Tips & Edukasi', slug: 'tips-edukasi', sortOrder: 2 },
  })
  await prisma.category.create({
    data: { type: CategoryType.CLASS, name: 'Kelas Gelato', slug: 'kelas-gelato', sortOrder: 1 },
  })

  // 4. Products (~8 across the 4 product categories).
  const productsData = [
    {
      name: 'Mesin Espresso Profesional 2 Group',
      slug: 'mesin-espresso-profesional-2-group',
      sku: 'CM-ESP-2G',
      brand: 'La Italia',
      categoryId: catCoffee.id,
      shortDescription: 'Mesin espresso 2 group untuk kafe dengan volume tinggi.',
      fullDescription:
        '<p>Mesin espresso profesional dengan boiler ganda, kontrol suhu PID, dan konstruksi stainless steel. Cocok untuk kafe specialty dan hotel.</p>',
      specifications: {
        Daya: '3200 W',
        Tegangan: '220V',
        'Kapasitas Boiler': '11 L',
        Group: '2',
        Dimensi: '78 x 55 x 52 cm',
      },
      price: 45_000_000,
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      name: 'Coffee Grinder Otomatis On-Demand',
      slug: 'coffee-grinder-otomatis-on-demand',
      sku: 'CM-GRD-OD',
      brand: 'MacinaPro',
      categoryId: catCoffee.id,
      shortDescription: 'Penggiling kopi presisi dengan dosis otomatis.',
      fullDescription:
        '<p>Grinder on-demand dengan burr flat 64mm dan pengaturan grind step-less untuk konsistensi espresso.</p>',
      specifications: { Daya: '350 W', Burr: 'Flat 64mm', Hopper: '1.2 kg', Dimensi: '20 x 28 x 55 cm' },
      price: 12_500_000,
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      name: 'Mesin Gelato Batch Freezer 5L',
      slug: 'mesin-gelato-batch-freezer-5l',
      sku: 'GL-BF-5L',
      brand: 'GelatoTech',
      categoryId: catGelato.id,
      shortDescription: 'Batch freezer kompak untuk gelato artisan.',
      fullDescription:
        '<p>Batch freezer dengan kapasitas produksi hingga 5 liter per siklus, pendingin udara, dan panel kontrol digital.</p>',
      specifications: { Daya: '2800 W', Kapasitas: '5 L / siklus', Produksi: '~18 L/jam', Pendingin: 'Udara' },
      price: 78_000_000,
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      name: 'Display Gelato 12 Rasa',
      slug: 'display-gelato-12-rasa',
      sku: 'GL-DSP-12',
      brand: 'FreddoLine',
      categoryId: catGelato.id,
      shortDescription: 'Etalase pajangan gelato dengan 12 carapina.',
      fullDescription:
        '<p>Display gelato ventilasi statis dengan kaca melengkung, pencahayaan LED, dan suhu hingga -18°C.</p>',
      specifications: { Daya: '900 W', Pan: '12 x 5L', Suhu: '-12°C s/d -18°C', Dimensi: '120 x 70 x 130 cm' },
      price: 56_000_000,
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      name: 'Oven Konveksi 4 Tray',
      slug: 'oven-konveksi-4-tray',
      sku: 'KT-OVN-4T',
      brand: 'FornoMax',
      categoryId: catKitchen.id,
      shortDescription: 'Oven konveksi dengan humidifier untuk pastry & roti.',
      fullDescription:
        '<p>Oven konveksi listrik 4 tray dengan steam injection, ideal untuk bakery dan pastry HoReCa.</p>',
      specifications: { Daya: '6400 W', Tray: '4 x 60x40 cm', Suhu: 'maks 300°C', Steam: 'Ya' },
      price: 23_500_000,
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      name: 'Planetary Mixer 20L',
      slug: 'planetary-mixer-20l',
      sku: 'KT-MIX-20',
      brand: 'ImpastoPro',
      categoryId: catKitchen.id,
      shortDescription: 'Mixer planetari serbaguna untuk adonan & krim.',
      fullDescription:
        '<p>Mixer planetari 20 liter dengan 3 attachment (whisk, beater, hook) dan transmisi gigi tahan lama.</p>',
      specifications: { Daya: '1100 W', Kapasitas: '20 L', Kecepatan: '3 tingkat', Attachment: 'Whisk, Beater, Hook' },
      price: 18_900_000,
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      name: 'Sistem Filter Air Komersial',
      slug: 'sistem-filter-air-komersial',
      sku: 'OT-WTR-COM',
      brand: 'PuraAqua',
      categoryId: catOther.id,
      shortDescription: 'Filter air 3 tahap untuk mesin kopi & es.',
      fullDescription:
        '<p>Sistem filtrasi air komersial untuk melindungi mesin dari kerak dan menjaga rasa kopi tetap optimal.</p>',
      specifications: { Tahap: '3', 'Laju Alir': '2 L/menit', Koneksi: '3/8 inch' },
      price: 4_200_000,
      status: ContentStatus.DRAFT,
      isFeatured: false,
    },
    {
      name: 'Blender Bar Heavy Duty',
      slug: 'blender-bar-heavy-duty',
      sku: 'OT-BLD-HD',
      brand: 'MixMaster',
      categoryId: catOther.id,
      shortDescription: 'Blender bar tahan banting untuk frappe & smoothie.',
      fullDescription:
        '<p>Blender komersial dengan motor 3 HP, jar polikarbonat 2 liter, dan peredam suara untuk bar sibuk.</p>',
      specifications: { Daya: '2200 W', Jar: '2 L Polikarbonat', Motor: '3 HP', 'Sound Enclosure': 'Ya' },
      price: 9_800_000,
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
    },
  ]

  for (const p of productsData) {
    const primary = await createMedia(`prod-${p.slug}`, `${p.slug}.jpg`, p.name)
    const extra = await createMedia(`prod-${p.slug}-2`, `${p.slug}-2.jpg`, `${p.name} — galeri`)
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        brand: p.brand,
        categoryId: p.categoryId,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription,
        specifications: p.specifications,
        price: p.price,
        currency: 'IDR',
        primaryImageId: primary.id,
        status: p.status,
        isFeatured: p.isFeatured,
        publishedAt: p.status === ContentStatus.PUBLISHED ? new Date() : null,
      },
    })
    await prisma.productImage.createMany({
      data: [
        { productId: product.id, mediaId: primary.id, sortOrder: 0 },
        { productId: product.id, mediaId: extra.id, sortOrder: 1 },
      ],
    })
  }

  // 5. Articles (3).
  const articlesData = [
    {
      title: 'Memilih Mesin Espresso yang Tepat untuk Kafe Anda',
      slug: 'memilih-mesin-espresso-untuk-kafe',
      excerpt: 'Panduan singkat memilih jumlah group, boiler, dan fitur sesuai volume kafe.',
      content:
        '<p>Memilih mesin espresso bukan hanya soal merek. Pertimbangkan volume harian, jumlah barista, dan ruang yang tersedia...</p><p>Untuk kafe sibuk, mesin 2 group dengan boiler besar adalah pilihan aman.</p>',
      categoryId: catTips.id,
    },
    {
      title: 'Tren Gelato Artisan di Indonesia 2026',
      slug: 'tren-gelato-artisan-indonesia-2026',
      excerpt: 'Permintaan gelato premium terus tumbuh — ini yang perlu diketahui pelaku usaha.',
      content:
        '<p>Gelato artisan semakin diminati seiring meningkatnya selera konsumen Indonesia terhadap dessert premium...</p>',
      categoryId: catNews.id,
    },
    {
      title: 'Tips Perawatan Mesin Kopi agar Awet',
      slug: 'tips-perawatan-mesin-kopi',
      excerpt: 'Rutinitas pembersihan harian dan kalibrasi yang memperpanjang umur mesin.',
      content:
        '<p>Backflush harian, penggantian filter air berkala, dan descaling rutin adalah kunci mesin kopi yang awet...</p>',
      categoryId: catTips.id,
    },
  ]

  for (const a of articlesData) {
    const cover = await createMedia(`art-${a.slug}`, `${a.slug}.jpg`, a.title)
    await prisma.article.create({
      data: {
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: a.content,
        coverImageId: cover.id,
        categoryId: a.categoryId,
        authorId: owner.id,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    })
  }

  // 6. Gelato class with sessions (1).
  const classCover = await createMedia('class-gelato-dasar', 'kelas-gelato-dasar.jpg', 'Kelas Gelato Dasar')
  await prisma.gelatoClass.create({
    data: {
      title: 'Kelas Gelato Dasar',
      slug: 'kelas-gelato-dasar',
      description: 'Belajar membuat gelato artisan dari nol bersama instruktur berpengalaman.',
      content:
        '<p>Dalam kelas ini Anda akan mempelajari dasar formulasi base, balancing gula, dan teknik mantecazione.</p>',
      coverImageId: classCover.id,
      instructor: 'Chef Marco',
      level: 'Pemula',
      price: 1_500_000,
      status: ContentStatus.PUBLISHED,
      sessions: {
        create: [
          {
            startDatetime: new Date('2026-07-05T09:00:00'),
            endDatetime: new Date('2026-07-05T15:00:00'),
            location: 'Jakarta',
            capacity: 12,
            status: SessionStatus.SCHEDULED,
          },
          {
            startDatetime: new Date('2026-08-09T09:00:00'),
            endDatetime: new Date('2026-08-09T15:00:00'),
            location: 'Surabaya',
            capacity: 10,
            status: SessionStatus.SCHEDULED,
          },
        ],
      },
    },
  })

  // 7. Promo & Event (2).
  const promoCover = await createMedia('promo-awal-tahun', 'promo-awal-tahun.jpg', 'Promo Awal Tahun')
  await prisma.promoEvent.create({
    data: {
      title: 'Promo Awal Tahun: Diskon Mesin Kopi',
      slug: 'promo-awal-tahun',
      type: PromoEventType.PROMO,
      content: '<p>Dapatkan diskon hingga 15% untuk pembelian mesin kopi pilihan sepanjang periode promo.</p>',
      coverImageId: promoCover.id,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-02-28'),
      status: ContentStatus.PUBLISHED,
    },
  })
  await prisma.promoEvent.create({
    data: {
      title: 'Pameran HoReCa Expo 2026',
      slug: 'horeca-expo-2026',
      type: PromoEventType.EVENT,
      content: '<p>Kunjungi booth Espresso Italia untuk demo mesin terbaru dan konsultasi gratis.</p>',
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-13'),
      status: ContentStatus.PUBLISHED,
    },
  })

  // 8. Home sections.
  const homeSections = [
    {
      key: HomeSectionKey.HERO,
      sortOrder: 1,
      payload: {
        title: 'Solusi Lengkap Mesin Kopi & Gelato untuk Bisnis Anda',
        subtitle: 'Distributor resmi peralatan HoReCa premium di Indonesia.',
        ctaText: 'Lihat Produk',
        ctaHref: '/produk',
        imageUrl: img('hero', 1600, 900),
      },
    },
    {
      key: HomeSectionKey.BRANDS,
      sortOrder: 2,
      payload: { title: 'Brand Partner', items: ['La Italia', 'GelatoTech', 'FornoMax', 'PuraAqua'] },
    },
    {
      key: HomeSectionKey.CLIENTS,
      sortOrder: 3,
      payload: { title: 'Dipercaya Oleh', items: ['Hotel Bintang 5', 'Kafe Specialty', 'Restoran HoReCa'] },
    },
    {
      key: HomeSectionKey.FLYER,
      sortOrder: 4,
      payload: { title: 'Katalog Terbaru', imageUrl: img('flyer', 1200, 800) },
    },
    {
      key: HomeSectionKey.FEATURED,
      sortOrder: 5,
      payload: { title: 'Produk Unggulan', subtitle: 'Pilihan terbaik untuk usaha Anda.' },
    },
  ]
  for (const s of homeSections) {
    await prisma.homeSection.create({ data: s })
  }

  // 9. Settings.
  const settings = [
    {
      key: 'promoBar',
      value: { enabled: true, text: 'Gratis konsultasi untuk pembelian mesin profesional ☕', href: '/kontak' },
    },
    {
      key: 'whatsapp',
      value: { number: '628123456789', defaultMessage: 'Halo Espresso Italia, saya ingin bertanya tentang produk.' },
    },
    {
      key: 'footer',
      value: { address: 'Jakarta, Indonesia', email: 'info@espressoitalia.id', phone: '+62 21 1234 5678' },
    },
    { key: 'logo', value: { url: img('logo', 200, 80), alt: 'Espresso Italia' } },
  ]
  for (const s of settings) {
    await prisma.setting.create({ data: s })
  }

  const [users, products, articles, classes, promos] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.article.count(),
    prisma.gelatoClass.count(),
    prisma.promoEvent.count(),
  ])
  console.log(
    `✅ Seed selesai: ${users} user, ${products} produk, ${articles} artikel, ${classes} kelas, ${promos} promo/event`,
  )
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
