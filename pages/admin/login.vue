<script setup lang="ts">
definePageMeta({ layout: false })

const { isLoggedIn, setAdminSession } = useAdminSession()
const router = useRouter()

if (isLoggedIn.value) {
  await navigateTo('/admin')
}

async function loginInstant() {
  setAdminSession()
  await nextTick()
  window.location.assign('/admin')
}

useSeoMeta({
  title: 'Masuk Admin — Espresso Italia',
  description: 'Login demo untuk panel admin Espresso Italia.',
})
</script>

<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(192,133,45,0.16),_transparent_35%),linear-gradient(180deg,_#2A1A12_0%,_#1A100B_100%)] px-4 py-10 text-cream">
    <div class="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center">
      <div class="grid w-full gap-6 rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <section class="flex flex-col justify-between rounded-[24px] bg-black/15 p-6 md:p-8">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.32em] text-caramel">Espresso Italia</p>
            <h1 class="mt-4 font-serif text-4xl leading-tight md:text-5xl">CMS prototipe siap dipakai</h1>
            <p class="mt-4 max-w-xl text-sm leading-7 text-cream/78 md:text-base">
              Login ini dibuat instan untuk demo. Klik sekali, langsung masuk ke panel admin dan mulai kelola konten.
            </p>
          </div>

          <div class="mt-8 grid gap-3 text-sm text-cream/80 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">Route cepat: /admin</div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">Menu: Produk, Artikel, Pengaturan</div>
          </div>
        </section>

        <section class="rounded-[24px] bg-white p-6 text-ink md:p-8">
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-caramel">Demo login</p>
          <h2 class="mt-3 font-serif text-3xl text-ink">Masuk ke CMS</h2>
          <p class="mt-3 text-sm leading-7 text-body">
            Tidak ada form rumit. Untuk prototipe, tombol di bawah langsung menandai sesi demo lalu membuka dashboard.
          </p>

          <div class="mt-6 rounded-2xl border border-line bg-panel/55 p-4 text-sm text-body">
            <p class="font-semibold text-ink">Status demo</p>
            <p class="mt-1">Akun login belum dipakai. CMS cukup dibuka via klik.</p>
          </div>

          <button type="button" class="btn-primary mt-6 w-full justify-center py-3 text-base" @click="loginInstant">
            Masuk ke Admin
          </button>

          <NuxtLink to="/" class="mt-4 inline-flex w-full justify-center text-sm font-medium text-caramelDark hover:underline">
            Kembali ke situs publik
          </NuxtLink>
        </section>
      </div>
    </div>
  </div>
</template>