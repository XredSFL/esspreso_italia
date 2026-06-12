<script setup lang="ts">
const route = useRoute()

const { data: article, error } = await useFetch(`/api/articles/${route.params.slug}`, {
  key: `article-${route.params.slug}`,
})

if (error.value || !article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan', fatal: true })
}

useSeoMeta({
  title: () => `${article.value?.title} — Espresso Italia`,
  description: () => article.value?.excerpt || article.value?.title || '',
  ogTitle: () => article.value?.title || '',
  ogDescription: () => article.value?.excerpt || '',
  ogImage: () => article.value?.coverImage?.url || '',
  ogType: 'article',
})
</script>

<template>
  <article v-if="article" class="container-page py-8">
    <nav class="mb-6 text-sm text-muted">
      <NuxtLink to="/" class="hover:text-caramelDark">Beranda</NuxtLink>
      <span class="mx-1.5">/</span>
      <NuxtLink to="/blog" class="hover:text-caramelDark">Blog</NuxtLink>
      <span class="mx-1.5">/</span>
      <span class="text-ink">{{ article.title }}</span>
    </nav>

    <div class="mx-auto max-w-3xl">
      <div class="flex flex-wrap items-center gap-2 text-sm text-muted">
        <span v-if="article.category" class="badge">{{ article.category.name }}</span>
        <span v-if="article.publishedAt">{{ formatDate(article.publishedAt) }}</span>
        <span v-if="article.author?.fullName">· oleh {{ article.author.fullName }}</span>
      </div>

      <h1 class="mt-4 font-serif text-3xl leading-tight text-ink md:text-4xl">
        {{ article.title }}
      </h1>
      <p v-if="article.excerpt" class="mt-4 text-lg text-body">{{ article.excerpt }}</p>

      <img
        v-if="article.coverImage?.url"
        :src="article.coverImage.url"
        :alt="article.coverImage.altText || article.title"
        class="mt-6 aspect-[16/9] w-full rounded-xl border border-line object-cover"
      />

      <!-- Content is authored in the CMS (trusted). -->
      <div class="rich-text mt-8" v-html="article.content" />

      <div class="mt-10 border-t border-line pt-6">
        <NuxtLink to="/blog" class="font-medium text-caramelDark hover:underline">
          ← Kembali ke Blog
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
