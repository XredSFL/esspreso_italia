<script setup lang="ts">
const route = useRoute()

const { data: product, error } = await useFetch(`/api/products/${route.params.slug}`, {
  key: `product-${route.params.slug}`,
})

if (error.value || !product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan', fatal: true })
}

// Gallery: prefer the joined images, fall back to the primary image.
const gallery = computed(() => {
  const imgs = (product.value?.images || []).map((i) => i.media).filter((m) => m?.url)
  if (imgs.length) return imgs
  return product.value?.primaryImage ? [product.value.primaryImage] : []
})
const selected = ref(0)

const specs = computed(() => {
  const s = product.value?.specifications
  return s && typeof s === 'object' && !Array.isArray(s) ? (s as Record<string, string>) : {}
})

// WhatsApp CTA — reuse the cached site settings for the number.
const { data: settings } = await useFetch('/api/settings', { key: 'site-settings' })
const waHref = computed(() => {
  const num = String((settings.value?.whatsapp as { number?: string })?.number || '').replace(
    /\D/g,
    '',
  )
  if (!num) return ''
  const msg = encodeURIComponent(
    `Halo Espresso Italia, saya tertarik dengan produk "${product.value?.name}".`,
  )
  return `https://wa.me/${num}?text=${msg}`
})

useSeoMeta({
  title: () => `${product.value?.name} — Espresso Italia`,
  description: () => product.value?.shortDescription || product.value?.name || '',
  ogTitle: () => product.value?.name || '',
  ogDescription: () => product.value?.shortDescription || '',
  ogImage: () => product.value?.primaryImage?.url || '',
  ogType: 'website',
})
</script>

<template>
  <div v-if="product" class="container-page py-8">
    <!-- Breadcrumb -->
    <nav class="mb-6 text-sm text-muted">
      <NuxtLink to="/" class="hover:text-caramelDark">Beranda</NuxtLink>
      <span class="mx-1.5">/</span>
      <NuxtLink to="/produk" class="hover:text-caramelDark">Produk</NuxtLink>
      <span class="mx-1.5">/</span>
      <span class="text-ink">{{ product.name }}</span>
    </nav>

    <div class="grid gap-10 lg:grid-cols-2">
      <!-- Gallery -->
      <div>
        <div class="aspect-square overflow-hidden rounded-xl border border-line bg-panel">
          <img
            v-if="gallery[selected]?.url"
            :src="gallery[selected].url"
            :alt="gallery[selected].altText || product.name"
            class="h-full w-full object-cover"
          />
        </div>
        <div v-if="gallery.length > 1" class="mt-3 flex gap-3">
          <button
            v-for="(img, i) in gallery"
            :key="i"
            class="h-20 w-20 overflow-hidden rounded-lg border-2 transition"
            :class="i === selected ? 'border-caramel' : 'border-line'"
            @click="selected = i"
          >
            <img :src="img.url" :alt="img.altText || product.name" class="h-full w-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Info -->
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <span v-if="product.category" class="badge">{{ product.category.name }}</span>
          <span v-if="product.brand" class="text-sm text-muted">{{ product.brand }}</span>
        </div>
        <h1 class="mt-3 font-serif text-3xl text-ink md:text-4xl">{{ product.name }}</h1>
        <p class="mt-4 text-2xl font-semibold text-espresso">{{ formatRupiah(product.price) }}</p>
        <p v-if="product.shortDescription" class="mt-4 text-body">{{ product.shortDescription }}</p>

        <div class="mt-6 flex flex-wrap gap-3">
          <a v-if="waHref" :href="waHref" target="_blank" rel="noopener noreferrer" class="btn-primary">
            Tanya via WhatsApp
          </a>
          <NuxtLink to="/produk" class="btn-outline">Kembali ke katalog</NuxtLink>
        </div>

        <p v-if="product.sku" class="mt-4 text-xs text-muted">SKU: {{ product.sku }}</p>

        <!-- Specifications -->
        <div v-if="Object.keys(specs).length" class="mt-8">
          <h2 class="font-serif text-xl text-ink">Spesifikasi</h2>
          <dl class="mt-3 overflow-hidden rounded-lg border border-line">
            <div
              v-for="([k, v], i) in Object.entries(specs)"
              :key="k"
              class="grid grid-cols-3 gap-2 px-4 py-2.5 text-sm"
              :class="i % 2 ? 'bg-white' : 'bg-panel/50'"
            >
              <dt class="font-medium text-ink">{{ k }}</dt>
              <dd class="col-span-2 text-body">{{ v }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Full description -->
    <section v-if="product.fullDescription" class="mt-12 max-w-3xl">
      <h2 class="font-serif text-2xl text-ink">Deskripsi</h2>
      <!-- Content is authored in the CMS (trusted). -->
      <div class="rich-text mt-4" v-html="product.fullDescription" />
    </section>
  </div>
</template>
