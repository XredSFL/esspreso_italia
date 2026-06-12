<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const route = useRoute()
const router = useRouter()

const search = ref((route.query.q as string) || '')
const activeStatus = computed(() => (route.query.status as string) || '')
const activeCategory = computed(() => (route.query.category as string) || '')

const query = computed(() => ({
  q: search.value.trim() || undefined,
  status: activeStatus.value || undefined,
  category: activeCategory.value || undefined,
  limit: 100,
}))

const { data: categories } = await useFetch('/api/categories', {
  key: 'admin-product-categories',
  query: { type: 'PRODUCT' },
  default: () => [],
})

const { data: products, pending, refresh } = await useFetch('/api/admin/products', {
  key: 'admin-products',
  query,
  default: () => [],
})

function applyFilters() {
  router.push({
    query: {
      ...route.query,
      q: search.value.trim() || undefined,
      status: activeStatus.value || undefined,
      category: activeCategory.value || undefined,
    },
  })
}

function resetFilters() {
  search.value = ''
  router.push({ query: {} })
}

function setStatus(status: string) {
  router.push({
    query: {
      ...route.query,
      status: status || undefined,
    },
  })
}

function setCategory(category: string) {
  router.push({
    query: {
      ...route.query,
      category: category || undefined,
    },
  })
}

useSeoMeta({ title: 'Produk Admin — Espresso Italia' })
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-2xl border border-line bg-white p-6 shadow-soft">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-caramel">Produk</p>
          <h1 class="mt-2 font-serif text-3xl text-ink">Manajemen Produk</h1>
          <p class="mt-2 text-sm text-body">
            Daftar ini sudah menarik data dari endpoint admin dan bisa difilter.
          </p>
        </div>
        <NuxtLink to="/admin/produk/new" class="btn-primary">Tambah Produk</NuxtLink>
      </div>

      <form class="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_180px_140px]" @submit.prevent="applyFilters">
        <input
          v-model="search"
          type="search"
          placeholder="Cari nama, SKU, merek..."
          class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel"
        >

        <select
          :value="activeStatus"
          class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel"
          @change="setStatus(($event.target as HTMLSelectElement).value)"
        >
          <option value="">Semua status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        <select
          :value="activeCategory"
          class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel"
          @change="setCategory(($event.target as HTMLSelectElement).value)"
        >
          <option value="">Semua kategori</option>
          <option v-for="category in categories" :key="category.id" :value="category.slug">
            {{ category.name }}
          </option>
        </select>

        <div class="flex gap-2">
          <button type="submit" class="btn-primary w-full">Filter</button>
          <button type="button" class="btn-outline w-full" @click="resetFilters">Reset</button>
        </div>
      </form>
    </section>

    <section class="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      <div class="border-b border-line px-6 py-4 text-sm text-body">
        {{ products.length }} produk ditemukan
      </div>

      <div v-if="pending" class="px-6 py-12 text-center text-body">
        Memuat data produk...
      </div>

      <div v-else-if="products.length" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-line text-left text-sm">
          <thead class="bg-panel/40 text-xs uppercase tracking-[0.18em] text-muted">
            <tr>
              <th class="px-6 py-4">Produk</th>
              <th class="px-6 py-4">Kategori</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Tayang</th>
              <th class="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr v-for="product in products" :key="product.id" class="align-top">
              <td class="px-6 py-4">
                <div class="flex items-start gap-4">
                  <div class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-panel">
                    <img
                      v-if="product.primaryImage?.url"
                      :src="product.primaryImage.url"
                      :alt="product.primaryImage.altText || product.name"
                      class="h-full w-full object-cover"
                    >
                  </div>
                  <div>
                    <p class="font-semibold text-ink">{{ product.name }}</p>
                    <p class="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                      {{ product.sku || 'SKU belum diisi' }}
                    </p>
                    <p v-if="product.brand" class="mt-1 text-sm text-body">{{ product.brand }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-body">
                {{ product.category?.name || 'Tanpa kategori' }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="
                    product.status === 'PUBLISHED'
                      ? 'bg-success/10 text-success'
                      : product.status === 'ARCHIVED'
                        ? 'bg-muted/10 text-muted'
                        : 'bg-caramel/10 text-caramelDark'
                  "
                >
                  {{ product.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-body">
                {{ product.isFeatured ? 'Featured' : 'Normal' }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-2">
                  <NuxtLink :to="`/admin/produk/${product.slug}`" class="btn-outline px-3 py-2 text-sm">Edit</NuxtLink>
                  <button type="button" class="btn-outline px-3 py-2 text-sm" @click="refresh()">Refresh</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="px-6 py-12 text-center text-body">
        Tidak ada produk yang cocok dengan filter saat ini.
      </div>
    </section>
  </div>
</template>