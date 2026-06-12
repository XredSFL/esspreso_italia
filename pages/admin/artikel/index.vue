<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const route = useRoute()
const router = useRouter()

const search = ref((route.query.q as string) || '')
const activeStatus = computed(() => (route.query.status as string) || '')

const query = computed(() => ({
  q: search.value.trim() || undefined,
  status: activeStatus.value || undefined,
  limit: 100,
}))

const { data: articles, pending, refresh } = await useFetch('/api/admin/articles', {
  key: 'admin-articles',
  query,
  default: () => [],
})

function applyFilters() {
  router.push({
    query: {
      ...route.query,
      q: search.value.trim() || undefined,
      status: activeStatus.value || undefined,
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

useSeoMeta({ title: 'Artikel Admin — Espresso Italia' })
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-2xl border border-line bg-white p-6 shadow-soft">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-caramel">Artikel</p>
          <h1 class="mt-2 font-serif text-3xl text-ink">Manajemen Artikel</h1>
          <p class="mt-2 text-sm text-body">Daftar artikel admin dengan filter status dan pencarian.</p>
        </div>
        <NuxtLink to="/admin/artikel/new" class="btn-primary">Tambah Artikel</NuxtLink>
      </div>

      <form class="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_140px]" @submit.prevent="applyFilters">
        <input v-model="search" type="search" placeholder="Cari judul atau ringkasan..." class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel">

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

        <div class="flex gap-2">
          <button type="submit" class="btn-primary w-full">Filter</button>
          <button type="button" class="btn-outline w-full" @click="resetFilters">Reset</button>
        </div>
      </form>
    </section>

    <section class="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      <div class="border-b border-line px-6 py-4 text-sm text-body">
        {{ articles.length }} artikel ditemukan
      </div>

      <div v-if="pending" class="px-6 py-12 text-center text-body">Memuat data artikel...</div>

      <div v-else-if="articles.length" class="divide-y divide-line">
        <article v-for="article in articles" :key="article.id" class="flex flex-wrap items-center gap-4 px-6 py-4">
          <div class="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-panel">
            <img v-if="article.coverImage?.url" :src="article.coverImage.url" :alt="article.coverImage.altText || article.title" class="h-full w-full object-cover">
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-xs uppercase tracking-[0.18em] text-muted">{{ article.category?.name || 'Tanpa kategori' }}</p>
            <h2 class="mt-1 font-semibold text-ink">{{ article.title }}</h2>
            <p class="mt-1 line-clamp-2 text-sm text-body">{{ article.excerpt || 'Belum ada ringkasan.' }}</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="article.status === 'PUBLISHED' ? 'bg-success/10 text-success' : article.status === 'ARCHIVED' ? 'bg-muted/10 text-muted' : 'bg-caramel/10 text-caramelDark'">{{ article.status }}</span>
            <NuxtLink :to="`/admin/artikel/${article.slug}`" class="btn-outline px-3 py-2 text-sm">Edit</NuxtLink>
            <button type="button" class="btn-outline px-3 py-2 text-sm" @click="refresh()">Refresh</button>
          </div>
        </article>
      </div>

      <div v-else class="px-6 py-12 text-center text-body">
        Belum ada artikel yang cocok.
      </div>
    </section>
  </div>
</template>