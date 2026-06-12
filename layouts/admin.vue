<script setup lang="ts">
const route = useRoute()
const { isLoggedIn, clearAdminSession } = useAdminSession()

const navigation = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Produk', to: '/admin/produk' },
  { label: 'Artikel', to: '/admin/artikel' },
  { label: 'Promo & Event', to: '/admin/promo-event' },
  { label: 'Section Beranda', to: '/admin/section-beranda' },
  { label: 'Kelas Gelato', to: '/admin/kelas-gelato' },
  { label: 'Media', to: '/admin/media' },
  { label: 'Pengaturan', to: '/admin/pengaturan' },
  { label: 'Pengguna', to: '/admin/pengguna' },
]

const currentUserLabel = computed(() => {
  return isLoggedIn.value ? 'Owner Demo' : 'Tamu CMS'
})

async function logout() {
  clearAdminSession()
  await navigateTo('/admin/login')
}

const isActive = (path: string) => route.path === path || route.path.startsWith(`${path}/`)
</script>

<template>
  <div class="min-h-screen bg-cream text-ink">
    <div class="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside class="border-r border-white/10 bg-espresso text-cream shadow-2xl shadow-espresso/20">
        <div class="border-b border-white/10 px-6 py-6">
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-caramel">Admin CMS</p>
          <h1 class="mt-2 font-serif text-2xl text-cream">Espresso Italia</h1>
          <p class="mt-2 text-sm text-cream/70">Prototype dashboard</p>
        </div>

        <nav class="flex-1 px-4 py-6">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="mb-1 block rounded-xl px-4 py-3 text-sm font-medium transition"
            :class="isActive(item.to) ? 'bg-caramel text-espresso' : 'text-cream/75 hover:bg-white/10 hover:text-cream'"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="border-t border-white/10 px-6 py-5 text-sm text-cream/70">
          Login demo aktif untuk prototipe.
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="border-b border-line bg-white/90 px-4 py-4 backdrop-blur md:px-8">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.28em] text-caramel">CMS</p>
              <h2 class="mt-1 font-serif text-2xl text-ink">Panel Admin</h2>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <div class="rounded-full border border-line bg-panel px-4 py-2 text-sm text-body">
                {{ currentUserLabel }}
              </div>
              <NuxtLink to="/" class="btn-outline">Lihat situs</NuxtLink>
              <button type="button" class="btn-primary" @click="logout">Keluar</button>
            </div>
          </div>
        </header>

        <main class="flex-1 px-4 py-6 md:px-8 md:py-8">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>