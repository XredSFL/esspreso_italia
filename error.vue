<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error?.statusCode === 404)

useSeoMeta({ title: () => `${props.error?.statusCode || 'Error'} — Espresso Italia` })

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-cream p-6">
    <div class="text-center">
      <p class="font-serif text-7xl font-bold text-espresso">{{ error?.statusCode || 500 }}</p>
      <p class="mt-4 text-lg text-body">
        {{ is404 ? 'Halaman yang Anda cari tidak ditemukan.' : error?.statusMessage || 'Terjadi kesalahan.' }}
      </p>
      <button class="btn-primary mt-8" @click="goHome">Kembali ke Beranda</button>
    </div>
  </div>
</template>
