<script setup lang="ts">
interface ArticleCardData {
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  category?: { name: string; slug: string } | null
  coverImage?: { url: string; altText?: string | null } | null
}

defineProps<{ article: ArticleCardData }>()
</script>

<template>
  <NuxtLink
    :to="`/blog/${article.slug}`"
    class="group flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
  >
    <div class="aspect-[16/9] overflow-hidden bg-panel">
      <img
        v-if="article.coverImage?.url"
        :src="article.coverImage.url"
        :alt="article.coverImage.altText || article.title"
        loading="lazy"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
    </div>
    <div class="flex flex-1 flex-col p-5">
      <div class="mb-2 flex items-center gap-2 text-xs text-muted">
        <span v-if="article.category" class="badge">{{ article.category.name }}</span>
        <span v-if="article.publishedAt">{{ formatDate(article.publishedAt) }}</span>
      </div>
      <h3 class="font-serif text-lg leading-snug text-ink group-hover:text-caramelDark">
        {{ article.title }}
      </h3>
      <p v-if="article.excerpt" class="mt-2 line-clamp-3 text-sm text-body">
        {{ article.excerpt }}
      </p>
      <span class="mt-4 text-sm font-medium text-caramelDark">Baca selengkapnya →</span>
    </div>
  </NuxtLink>
</template>
