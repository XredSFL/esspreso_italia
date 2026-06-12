<script setup lang="ts">
const route = useRoute()
const open = ref(false)

const nav = [
  { label: 'Beranda', to: '/' },
  { label: 'Produk', to: '/produk' },
  { label: 'Blog', to: '/blog' },
]

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}

// Close the mobile menu on navigation.
watch(() => route.fullPath, () => (open.value = false))
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
    <div class="container-page flex h-16 items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2">
        <span
          class="grid h-9 w-9 place-items-center rounded bg-espresso font-serif text-lg font-bold text-cream"
        >
          E
        </span>
        <span class="font-serif text-xl font-bold text-espresso">Espresso Italia</span>
      </NuxtLink>

      <nav class="hidden items-center gap-8 md:flex">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="font-medium transition-colors"
          :class="isActive(item.to) ? 'text-caramelDark' : 'text-ink hover:text-caramelDark'"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <button
        class="grid h-10 w-10 place-items-center rounded border border-line text-ink md:hidden"
        :aria-expanded="open"
        aria-label="Buka menu"
        @click="open = !open"
      >
        <svg
          v-if="!open"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <nav v-if="open" class="border-t border-line bg-cream md:hidden">
      <div class="container-page flex flex-col py-2">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="py-2.5 font-medium"
          :class="isActive(item.to) ? 'text-caramelDark' : 'text-ink'"
        >
          {{ item.label }}
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>
