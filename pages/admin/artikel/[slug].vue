<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const route = useRoute()
const router = useRouter()

const slug = computed(() => String(route.params.slug || ''))

const { data: categories } = await useFetch('/api/categories', {
  key: 'admin-article-edit-categories',
  query: { type: 'NEWS' },
  default: () => [],
})

const { data: article } = await useFetch(`/api/admin/articles/${slug.value}`, {
  key: () => `admin-article-${slug.value}`,
  default: () => null,
})

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  categorySlug: '',
  status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
})

const saving = ref(false)
const errorMessage = ref('')
const loading = ref(true)

watchEffect(() => {
  if (!article.value) {
    return
  }

  form.title = article.value.title ?? ''
  form.slug = article.value.slug ?? ''
  form.excerpt = article.value.excerpt ?? ''
  form.content = article.value.content ?? ''
  form.categorySlug = article.value.category?.slug ?? ''
  form.status = article.value.status ?? 'DRAFT'
  loading.value = false
})

async function saveArticle() {
  saving.value = true
  errorMessage.value = ''

  try {
    const updated = await $fetch<{ slug: string }>(`/api/admin/articles/${slug.value}`, {
      method: 'PUT',
      body: form,
    })

    if (updated.slug !== slug.value) {
      await router.replace(`/admin/artikel/${updated.slug}`)
    }
  } catch {
    errorMessage.value = 'Gagal menyimpan artikel. Coba lagi.'
  } finally {
    saving.value = false
  }
}

useSeoMeta({
  title: () => `Edit Artikel — ${String(route.params.slug || 'Espresso Italia')}`,
})
</script>

<template>
  <section class="rounded-2xl border border-line bg-white p-6 shadow-soft">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-caramel">Artikel</p>
        <h1 class="mt-2 font-serif text-3xl text-ink">Edit Artikel</h1>
      </div>
      <NuxtLink to="/admin/artikel" class="btn-outline">Kembali</NuxtLink>
    </div>

    <div v-if="loading" class="mt-6 rounded-2xl border border-dashed border-line bg-panel/40 p-6 text-sm text-body">
      Memuat detail artikel...
    </div>

    <form v-else class="mt-6 grid gap-4 md:grid-cols-2" @submit.prevent="saveArticle">
      <label class="block md:col-span-2">
        <span class="mb-2 block text-sm font-medium text-body">Judul</span>
        <input v-model="form.title" type="text" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel">
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
        <textarea v-model="form.content" rows="12" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel"></textarea>
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-medium text-body">Status</span>
        <select v-model="form.status" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </label>

      <div class="md:col-span-2">
        <p v-if="errorMessage" class="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</p>
      </div>

      <div class="flex flex-wrap gap-3 md:col-span-2">
        <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}</button>
        <NuxtLink :to="`/blog/${route.params.slug}`" class="btn-outline">Lihat Publik</NuxtLink>
      </div>
    </form>
  </section>
</template>