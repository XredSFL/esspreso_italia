<script setup lang="ts">
interface ProductCardData {
  name: string
  slug: string
  brand?: string | null
  shortDescription?: string | null
  price?: string | number | null
  currency?: string | null
  category?: { name: string; slug: string } | null
  primaryImage?: { url: string; altText?: string | null } | null
}

defineProps<{ product: ProductCardData }>()
</script>

<template>
  <NuxtLink
    :to="`/produk/${product.slug}`"
    class="group flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
  >
    <div class="aspect-[4/3] overflow-hidden bg-panel">
      <img
        v-if="product.primaryImage?.url"
        :src="product.primaryImage.url"
        :alt="product.primaryImage.altText || product.name"
        loading="lazy"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
    </div>
    <div class="flex flex-1 flex-col p-4">
      <div class="mb-2 flex items-center gap-2">
        <span v-if="product.category" class="badge">{{ product.category.name }}</span>
        <span v-if="product.brand" class="text-xs text-muted">{{ product.brand }}</span>
      </div>
      <h3 class="font-serif text-lg leading-snug text-ink group-hover:text-caramelDark">
        {{ product.name }}
      </h3>
      <p v-if="product.shortDescription" class="mt-1 line-clamp-2 text-sm text-body">
        {{ product.shortDescription }}
      </p>
      <p class="mt-3 font-semibold text-espresso">{{ formatRupiah(product.price) }}</p>
    </div>
  </NuxtLink>
</template>
