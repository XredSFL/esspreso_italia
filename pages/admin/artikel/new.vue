<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

useSeoMeta({ title: 'Tambah Artikel — Espresso Italia' })
const router = useRouter()

const { data: categories } = await useFetch('/api/categories', {
  key: 'admin-article-create-categories',
  query: { type: 'NEWS' },
  default: () => [],
})

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '<p>Tulis isi artikel di sini.</p>',
  categorySlug: '',
  status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
})

const saving = ref(false)
const errorMessage = ref('')

function syncSlug() {
  if (!form.slug) {
    form.slug = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
}

async function saveArticle() {
  saving.value = true
  errorMessage.value = ''

  try {
    const created = await $fetch<{ slug: string }>('/api/admin/articles', {
      method: 'POST',
      body: form,
    })

    await router.push(`/admin/artikel/${created.slug}`)
  } catch {
    errorMessage.value = 'Gagal menyimpan artikel. Coba lagi.'
  } finally {
    saving.value = false
  }
}

useSeoMeta({ title: 'Tambah Artikel — Espresso Italia' })
</script>

<template>
  <form class="rounded-2xl border border-line bg-white p-6 shadow-soft" @submit.prevent="saveArticle">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-caramel">Artikel</p>
        <h1 class="mt-2 font-serif text-3xl text-ink">Tambah Artikel</h1>
      </div>
      <NuxtLink to="/admin/artikel" class="btn-outline">Kembali</NuxtLink>
    </div>

    <div class="mt-6 grid gap-4 md:grid-cols-2">
      <label class="block md:col-span-2">
        <span class="mb-2 block text-sm font-medium text-body">Judul</span>
        <input v-model="form.title" type="text" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel" @blur="syncSlug">
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-medium text-body">Slug</span>
        <input v-model="form.slug" type="text" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel">
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-medium text-body">Kategori</span>
        <select v-model="form.categorySlug" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel">
          <option value="">Tanpa kategori</option>
          <option v-for="category in categories" :key="category.id" :value="category.slug">{{ category.name }}</option>
        </select>
      </label>

      <label class="block md:col-span-2">
        <span class="mb-2 block text-sm font-medium text-body">Ringkasan</span>
        <textarea v-model="form.excerpt" rows="3" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel"></textarea>
      </label>

      <label class="block md:col-span-2">
        <span class="mb-2 block text-sm font-medium text-body">Konten</span>
        <textarea v-model="form.content" rows="10" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel"></textarea>
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-medium text-body">Status</span>
        <select v-model="form.status" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </label>
    </div>

    <p v-if="errorMessage" class="mt-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</p>

    <div class="mt-6 flex flex-wrap gap-3">
      <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan Artikel' }}</button>
      <NuxtLink to="/admin/artikel" class="btn-outline">Batal</NuxtLink>
    </div>
  </form>
</template>