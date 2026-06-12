<script setup lang="ts">
const { data: articles } = await useFetch('/api/articles', { key: 'article-list', default: () => [] })

useSeoMeta({
  title: 'Blog — Espresso Italia',
  description:
    'Tips, edukasi, dan berita seputar mesin kopi, gelato, dan industri HoReCa dari Espresso Italia.',
})
</script>

<template>
  <div>
    <section class="bg-espresso text-cream">
      <div class="container-page py-12">
        <h1 class="font-serif text-3xl md:text-4xl">Blog</h1>
        <p class="mt-2 text-cream/80">Tips, edukasi, dan berita seputar dunia kopi & gelato.</p>
      </div>
    </section>

    <div class="container-page py-10">
      <div v-if="articles.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ArticleCard v-for="a in articles" :key="a.id" :article="a" />
      </div>
      <p v-else class="rounded-xl border border-line bg-white p-10 text-center text-muted">
        Belum ada artikel.
      </p>
    </div>
  </div>
</template>
