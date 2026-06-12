<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

useSeoMeta({ title: 'Pengaturan Admin — Espresso Italia' })
</script>

<template>
  <section class="rounded-2xl border border-line bg-white p-6 shadow-soft">
    <p class="text-xs font-semibold uppercase tracking-[0.28em] text-caramel">Pengaturan</p>
    <h1 class="mt-2 font-serif text-3xl text-ink">Pengaturan CMS</h1>
    <p class="mt-4 text-sm leading-7 text-body">
      Halaman ini masih stub. Nanti dipakai untuk promo bar, footer, WhatsApp, dan logo.
    </p>
  </section>
</template>