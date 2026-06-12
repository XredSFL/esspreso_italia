<script setup lang="ts">
defineProps<{
  promo: { text?: string; href?: string }
}>()
</script>

<template>
  <div class="bg-espresso text-cream">
    <div class="container-page flex items-center justify-center py-2 text-center text-sm">
      <NuxtLink
        v-if="promo.href"
        :to="promo.href"
        class="text-cream transition-colors hover:text-caramel"
      >
        {{ promo.text }}
      </NuxtLink>
      <span v-else>{{ promo.text }}</span>
    </div>
  </div>
</template>
