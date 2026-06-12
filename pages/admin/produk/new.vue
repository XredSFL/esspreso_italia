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
  photoUrl: '',
  brand: '',
  categorySlug: '',
  shortDescription: '',
  fullDescription: '',
  specifications: {
    Daya: '',
    'Gas Pendingin': '',
    'Kapasitas Maksimal Adonan': '',
    'Waktu Persiapan': '',
    'Produksi Maksimal per Jam': '',
    'Produksi Maksimal per Hari': '',
    'Dimensi (l x d x t)': '',
    Berat: '',
  } as Record<string, string>,
  price: '',
  currency: 'IDR',
  status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
  isFeatured: false,
})

const isSaving = ref(false)
const errorMessage = ref('')

const specificationRows = computed(() => [
  'Daya',
  'Gas Pendingin',
  'Kapasitas Maksimal Adonan',
  'Waktu Persiapan',
  'Produksi Maksimal per Jam',
  'Produksi Maksimal per Hari',
  'Dimensi (l x d x t)',
  'Berat',
].map((label) => ({ label, value: form.specifications[label] || '' })))

function setSpecification(label: string, value: string) {
  form.specifications[label] = value
}

async function saveProduct() {
  isSaving.value = true
  errorMessage.value = ''

  try {
    const result = await $fetch<{ slug: string }>('/api/admin/products', {
      method: 'POST',
      body: {
        name: form.name,
        photoUrl: form.photoUrl,
        brand: form.brand,
        categorySlug: form.categorySlug,
        shortDescription: form.shortDescription,
        fullDescription: form.fullDescription,
        specifications: form.specifications,
        price: form.price,
        currency: form.currency,
        status: form.status,
        isFeatured: form.isFeatured,
      },
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
          <input v-model="form.name" type="text" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel">
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-medium text-body">Foto Produk</span>
          <input v-model="form.photoUrl" type="url" placeholder="Tempel URL foto / Vercel Blob" class="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-caramel">
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
          <span class="mb-2 block text-sm font-medium text-body">Spesifikasi</span>
          <div class="overflow-hidden rounded-2xl border border-line">
            <table class="min-w-full divide-y divide-line text-sm">
              <thead class="bg-panel/50 text-left text-xs uppercase tracking-[0.16em] text-muted">
                <tr>
                  <th class="px-4 py-3">Spesifikasi</th>
                  <th class="px-4 py-3">Detail</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-line bg-white">
                <tr v-for="row in specificationRows" :key="row.label">
                  <td class="px-4 py-3 font-medium text-ink">{{ row.label }}</td>
                  <td class="px-4 py-3">
                    <input
                      :value="row.value"
                      type="text"
                      class="w-full rounded-lg border border-line bg-white px-3 py-2 text-ink outline-none focus:border-caramel"
                      @input="setSpecification(row.label, ($event.target as HTMLInputElement).value)"
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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