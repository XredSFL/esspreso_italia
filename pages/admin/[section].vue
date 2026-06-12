<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const route = useRoute()

const sectionMeta: Record<string, { title: string; description: string }> = {
  produk: {
    title: 'Produk',
    description: 'Scaffold daftar, filter, dan form produk akan diletakkan di sini.',
  },
  artikel: {
    title: 'Artikel',
    description: 'Area ini nanti dipakai untuk editor artikel dan cover image.',
  },
  'promo-event': {
    title: 'Promo & Event',
    description: 'Kelola banner promo dan event marketing dari satu halaman.',
  },
  'section-beranda': {
    title: 'Section Beranda',
    description: 'Atur hero, featured product, brand strip, dan konten beranda lain.',
  },
  'kelas-gelato': {
    title: 'Kelas Gelato',
    description: 'Module kelas dan jadwal sesi masih berupa placeholder.',
  },
  media: {
    title: 'Media',
    description: 'Galeri aset untuk gambar produk, artikel, dan banner.',
  },
  pengaturan: {
    title: 'Pengaturan',
    description: 'Setting umum seperti promo bar, footer, WhatsApp, dan logo.',
  },
  pengguna: {
    title: 'Pengguna',
    description: 'Daftar user admin dan role access akan diisi bertahap.',
  },
}

const currentSection = computed(() => String(route.params.section || ''))
const meta = computed(() => sectionMeta[currentSection.value] ?? null)

useSeoMeta({
  title: () => `${meta.value?.title || 'Admin'} — Espresso Italia`,
  description: () => meta.value?.description || 'Scaffold panel admin Espresso Italia.',
})
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-2xl border border-line bg-white p-6 shadow-soft">
      <p class="text-xs font-semibold uppercase tracking-[0.28em] text-caramel">Scaffold modul</p>
      <h1 class="mt-2 font-serif text-3xl text-ink">{{ meta?.title || 'Modul Admin' }}</h1>
      <p class="mt-3 max-w-2xl text-body">
        {{ meta?.description || 'Halaman admin ini belum memiliki isi final, tetapi route dan layout-nya sudah aktif.' }}
      </p>

      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink to="/admin" class="btn-primary">Kembali ke dashboard</NuxtLink>
        <NuxtLink to="/admin/produk" class="btn-outline">Buka produk</NuxtLink>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-line bg-panel p-6">
        <p class="text-sm font-semibold text-caramel">Langkah berikut</p>
        <p class="mt-2 text-sm text-body">Isi CRUD dan form detail untuk modul {{ meta?.title || 'ini' }}.</p>
      </div>
      <div class="rounded-2xl border border-line bg-white p-6">
        <p class="text-sm font-semibold text-caramel">Catatan</p>
        <p class="mt-2 text-sm text-body">Route ini sudah diproteksi cookie session demo.</p>
      </div>
      <div class="rounded-2xl border border-line bg-espresso p-6 text-cream">
        <p class="text-sm font-semibold text-caramel">CTA</p>
        <p class="mt-2 text-sm text-cream/75">Buka modul berikutnya dari sidebar.</p>
      </div>
    </div>
  </div>
</template>