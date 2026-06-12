<script setup lang="ts">
interface Hero {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
  imageUrl?: string
}

const { data } = await useFetch('/api/home', { key: 'home' })

const hero = computed(() => (data.value?.hero ?? null) as Hero | null)
const featuredProducts = computed(() => data.value?.featuredProducts ?? [])
const latestArticles = computed(() => data.value?.latestArticles ?? [])

useSeoMeta({
  title: 'Espresso Italia — Mesin Kopi, Gelato & Peralatan HoReCa',
  description:
    'Distributor mesin kopi, mesin gelato, dan peralatan dapur HoReCa premium di Indonesia. Lihat produk unggulan dan artikel terbaru kami.',
  ogTitle: 'Espresso Italia',
  ogDescription:
    'Distributor mesin kopi, mesin gelato, dan peralatan dapur HoReCa premium di Indonesia.',
  ogType: 'website',
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-espresso text-cream">
      <img
        v-if="hero?.imageUrl"
        :src="hero.imageUrl"
        alt=""
        class="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div class="container-page relative grid gap-8 py-20 md:grid-cols-2 md:py-28">
        <div class="flex flex-col justify-center">
          <p class="text-sm font-semibold uppercase tracking-[0.25em] text-caramel">
            Espresso Italia
          </p>
          <h1 class="mt-4 font-serif text-4xl leading-tight text-cream md:text-5xl">
            {{ hero?.title || 'Solusi Lengkap Mesin Kopi & Gelato untuk Bisnis Anda' }}
          </h1>
          <p class="mt-5 max-w-md text-cream/80">
            {{
              hero?.subtitle ||
              'Distributor resmi peralatan HoReCa premium di Indonesia.'
            }}
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink :to="hero?.ctaHref || '/produk'" class="btn-primary">
              {{ hero?.ctaText || 'Lihat Produk' }}
            </NuxtLink>
            <NuxtLink to="/blog" class="btn-outline border-cream/30 bg-transparent text-cream hover:bg-cream/10 hover:text-cream">
              Baca Artikel
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured products -->
    <section class="container-page py-16">
      <div class="mb-8 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-widest text-caramel">Produk Unggulan</p>
          <h2 class="mt-1 font-serif text-3xl text-ink">Pilihan terbaik untuk usaha Anda</h2>
        </div>
        <NuxtLink to="/produk" class="hidden shrink-0 font-medium text-caramelDark hover:underline sm:block">
          Lihat semua →
        </NuxtLink>
      </div>

      <div v-if="featuredProducts.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard v-for="p in featuredProducts" :key="p.id" :product="p" />
      </div>
      <p v-else class="rounded-xl border border-line bg-white p-8 text-center text-muted">
        Belum ada produk unggulan.
      </p>

      <div class="mt-8 text-center sm:hidden">
        <NuxtLink to="/produk" class="btn-outline">Lihat semua produk</NuxtLink>
      </div>
    </section>

    <!-- Latest articles -->
    <section class="bg-panel/60">
      <div class="container-page py-16">
        <div class="mb-8 flex items-end justify-between gap-4">
          <div>
            <p class="text-sm font-semibold uppercase tracking-widest text-caramel">Blog</p>
            <h2 class="mt-1 font-serif text-3xl text-ink">Artikel terbaru</h2>
          </div>
          <NuxtLink to="/blog" class="hidden shrink-0 font-medium text-caramelDark hover:underline sm:block">
            Lihat semua →
          </NuxtLink>
        </div>

        <div v-if="latestArticles.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ArticleCard v-for="a in latestArticles" :key="a.id" :article="a" />
        </div>
        <p v-else class="rounded-xl border border-line bg-white p-8 text-center text-muted">
          Belum ada artikel.
        </p>
      </div>
    </section>
  </div>
</template>
