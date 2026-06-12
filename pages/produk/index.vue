<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const activeCategory = computed(() => (route.query.category as string) || '')
const activeQuery = computed(() => (route.query.q as string) || '')

// Local model for the search box (synced from the URL).
const search = ref(activeQuery.value)
watch(activeQuery, (v) => (search.value = v))

const { data: categories } = await useFetch('/api/categories', {
  key: 'product-categories',
  query: { type: 'PRODUCT' },
  default: () => [],
})

// Re-fetches automatically when the reactive query changes.
const apiQuery = computed(() => ({
  q: activeQuery.value || undefined,
  category: activeCategory.value || undefined,
}))
const { data: products, pending } = await useFetch('/api/products', {
  key: 'product-list',
  query: apiQuery,
  default: () => [],
})

function selectCategory(slug: string) {
  router.push({ query: { ...route.query, category: slug || undefined } })
}
function submitSearch() {
  router.push({ query: { ...route.query, q: search.value.trim() || undefined } })
}
function resetFilters() {
  search.value = ''
  router.push({ query: {} })
}

useSeoMeta({
  title: 'Katalog Produk — Espresso Italia',
  description:
    'Jelajahi mesin kopi, mesin gelato, dan peralatan dapur HoReCa. Filter berdasarkan kategori dan cari produk yang Anda butuhkan.',
})
</script>

<template>
  <div>
    <!-- Page header -->
    <section class="bg-espresso text-cream">
      <div class="container-page py-12">
        <h1 class="font-serif text-3xl md:text-4xl">Katalog Produk</h1>
        <p class="mt-2 text-cream/80">Mesin kopi, gelato, dan peralatan dapur HoReCa.</p>
      </div>
    </section>

    <div class="container-page py-10">
      <!-- Search -->
      <form class="mb-6 flex gap-3" @submit.prevent="submitSearch">
        <input
          v-model="search"
          type="search"
          placeholder="Cari produk, merek…"
          class="w-full rounded border border-line bg-white px-4 py-2.5 text-ink outline-none focus:border-caramel"
        />
        <button type="submit" class="btn-primary shrink-0">Cari</button>
      </form>

      <!-- Category filter -->
      <div class="mb-8 flex flex-wrap gap-2">
        <button
          class="rounded-full border px-4 py-1.5 text-sm transition"
          :class="
            activeCategory === ''
              ? 'border-caramel bg-caramel text-espresso'
              : 'border-line bg-white text-ink hover:border-caramel'
          "
          @click="selectCategory('')"
        >
          Semua
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="rounded-full border px-4 py-1.5 text-sm transition"
          :class="
            activeCategory === cat.slug
              ? 'border-caramel bg-caramel text-espresso'
              : 'border-line bg-white text-ink hover:border-caramel'
          "
          @click="selectCategory(cat.slug)"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Results -->
      <p v-if="pending" class="py-12 text-center text-muted">Memuat produk…</p>

      <template v-else>
        <div v-if="products.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard v-for="p in products" :key="p.id" :product="p" />
        </div>

        <div v-else class="rounded-xl border border-line bg-white p-10 text-center">
          <p class="text-ink">Tidak ada produk yang cocok.</p>
          <button class="btn-outline mt-4" @click="resetFilters">Reset filter</button>
        </div>
      </template>
    </div>
  </div>
</template>
