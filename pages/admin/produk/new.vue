<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const router = useRouter()

const categories = await useFetch('/api/categories', {
  key: 'admin-product-categories-new',
  query: { type: 'PRODUCT' },
  default: () => [],
})

const form = reactive({
  name: '',
  slug: '',
  sku: '',
  brand: '',
  categorySlug: '',
  shortDescription: '',
  fullDescription: '',
  specificationsText: '{\n  "mesin": "espresso"\n}',
  price: '',
  currency: 'IDR',
  status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
  isFeatured: false,
})

const isSaving = ref(false)
const errorMessage = ref('')

function syncSlug() {
  if (!form.slug) {
    form.slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
}

async function saveProduct() {
  isSaving.value = true
  errorMessage.value = ''

  try {
    const result = await $fetch<{ slug: string }>('/api/admin/products', {
      method: 'POST',
      body: form,
    })

    await router.push(`/admin/produk/${result.slug}`)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal menyimpan produk.'
  } finally {
    isSaving.value = false
  }
}

useSeoMeta({ title: 'Tambah Produk — Espresso Italia' })
</script>

<template>
  <form class="space-y-6" @submit.prevent="saveProduct">
    <section class="rounded-2xl border border-line bg-white p-6 shadow-soft">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-caramel">Produk</p>
          <h1 class="mt-2 font-serif text-3xl text-ink">Tambah Produk</h1>
          <p class="mt-2 text-sm text-body">Form ini langsung menyimpan data ke database prototipe.</p>
        </div>
        <NuxtLink to="/admin/produk" class="btn-outline">Kembali</NuxtLink>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <label class="block">
          <span class="mb-2 block text-sm font-medium text-body">Nama Produk</span>
          <input v-model="form.name" type="text" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel" @blur="syncSlug">
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-medium text-body">Slug</span>
          <input v-model="form.slug" type="text" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel">
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-medium text-body">SKU</span>
          <input v-model="form.sku" type="text" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel">
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-medium text-body">Brand</span>
          <input v-model="form.brand" type="text" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel">
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-medium text-body">Kategori</span>
          <select v-model="form.categorySlug" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel">
            <option value="">Tanpa kategori</option>
            <option v-for="category in categories.data.value" :key="category.id" :value="category.slug">{{ category.name }}</option>
          </select>
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-medium text-body">Harga</span>
          <input v-model="form.price" type="text" placeholder="contoh: 12500000" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel">
        </label>

        <label class="block md:col-span-2">
          <span class="mb-2 block text-sm font-medium text-body">Deskripsi Singkat</span>
          <textarea v-model="form.shortDescription" rows="3" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel"></textarea>
        </label>

        <label class="block md:col-span-2">
          <span class="mb-2 block text-sm font-medium text-body">Deskripsi Lengkap</span>
          <textarea v-model="form.fullDescription" rows="6" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel"></textarea>
        </label>

        <label class="block md:col-span-2">
          <span class="mb-2 block text-sm font-medium text-body">Specifications JSON</span>
          <textarea v-model="form.specificationsText" rows="8" class="w-full rounded-xl border border-line bg-white px-4 py-3 font-mono text-sm text-ink outline-none focus:border-caramel"></textarea>
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-medium text-body">Status</span>
          <select v-model="form.status" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel">
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>

        <label class="flex items-center gap-3 rounded-xl border border-line bg-panel/40 px-4 py-3">
          <input v-model="form.isFeatured" type="checkbox" class="h-4 w-4 rounded border-line text-caramel focus:ring-caramel">
          <span class="text-sm text-body">Tandai sebagai featured</span>
        </label>
      </div>

      <p v-if="errorMessage" class="mt-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
        {{ errorMessage }}
      </p>

      <div class="mt-6 flex flex-wrap gap-3">
        <button type="submit" class="btn-primary" :disabled="isSaving">{{ isSaving ? 'Menyimpan...' : 'Simpan Produk' }}</button>
        <NuxtLink to="/admin/produk" class="btn-outline">Batal</NuxtLink>
      </div>
    </section>
  </form>
</template>