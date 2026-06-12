<script setup lang="ts">
interface PromoBar {
  enabled?: boolean
  text?: string
  href?: string
}
interface Whatsapp {
  number?: string
  defaultMessage?: string
}
interface Footer {
  address?: string
  email?: string
  phone?: string
}

// Site-wide settings (promo bar, footer, WhatsApp). Cached across pages.
const { data: settings } = await useFetch('/api/settings', {
  key: 'site-settings',
  default: () => ({}) as Record<string, unknown>,
})

const promoBar = computed(() => settings.value?.promoBar as PromoBar | undefined)
const whatsapp = computed(() => settings.value?.whatsapp as Whatsapp | undefined)
const footer = computed(() => settings.value?.footer as Footer | undefined)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-cream">
    <PromoBar v-if="promoBar?.enabled" :promo="promoBar" />
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter :footer="footer" />
    <WhatsappButton v-if="whatsapp?.number" :whatsapp="whatsapp" />
  </div>
</template>
