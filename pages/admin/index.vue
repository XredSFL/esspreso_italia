<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

useSeoMeta({
  title: 'Dashboard Admin — Espresso Italia',
  description: 'Dashboard prototipe CMS Espresso Italia.',
})
</script>

<template>
  <div class="space-y-6">
    <section class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-line bg-white p-5 shadow-soft">
        <p class="text-sm font-medium text-muted">Produk</p>
        <p class="mt-2 font-serif text-3xl text-ink">8</p>
        <p class="mt-1 text-sm text-body">Data contoh siap diedit.</p>
      </div>
      <div class="rounded-2xl border border-line bg-white p-5 shadow-soft">
        <p class="text-sm font-medium text-muted">Artikel</p>
        <p class="mt-2 font-serif text-3xl text-ink">3</p>
        <p class="mt-1 text-sm text-body">Blog CMS sudah bisa dibuka.</p>
      </div>
      <div class="rounded-2xl border border-line bg-white p-5 shadow-soft">
        <p class="text-sm font-medium text-muted">Status</p>
        <p class="mt-2 font-serif text-3xl text-success">Aktif</p>
        <p class="mt-1 text-sm text-body">Login demo siap pakai.</p>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="rounded-2xl border border-line bg-white p-6 shadow-soft">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-caramel">Langkah berikutnya</p>
        <h3 class="mt-2 font-serif text-2xl text-ink">Scaffold modul CMS</h3>
        <ul class="mt-4 space-y-3 text-sm leading-7 text-body">
          <li>• Tambah daftar Produk dengan tabel dan aksi CRUD</li>
          <li>• Tambah daftar Artikel dan editor konten</li>
          <li>• Tambah halaman Pengaturan, Media, dan stub modul lain</li>
        </ul>
      </div>

      <div class="rounded-2xl border border-line bg-panel/50 p-6 shadow-soft">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-caramel">Akses cepat</p>
        <div class="mt-4 space-y-3 text-sm">
          <NuxtLink to="/admin/produk" class="block rounded-xl bg-white px-4 py-3 font-medium text-ink hover:bg-cream">Buka Produk</NuxtLink>
          <NuxtLink to="/admin/artikel" class="block rounded-xl bg-white px-4 py-3 font-medium text-ink hover:bg-cream">Buka Artikel</NuxtLink>
          <NuxtLink to="/admin/pengaturan" class="block rounded-xl bg-white px-4 py-3 font-medium text-ink hover:bg-cream">Buka Pengaturan</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>