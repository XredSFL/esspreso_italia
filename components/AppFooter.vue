<script setup lang="ts">
defineProps<{
  footer?: { address?: string; email?: string; phone?: string }
}>()

const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 bg-espresso text-cream/80">
    <div class="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <p class="font-serif text-xl font-bold text-cream">Espresso Italia</p>
        <p class="mt-3 max-w-xs text-sm leading-relaxed">
          Distributor mesin kopi, mesin gelato, dan peralatan dapur HoReCa premium di Indonesia.
        </p>
      </div>

      <div>
        <p class="font-semibold text-cream">Tautan</p>
        <ul class="mt-3 space-y-2 text-sm">
          <li><NuxtLink to="/" class="hover:text-caramel">Beranda</NuxtLink></li>
          <li><NuxtLink to="/produk" class="hover:text-caramel">Produk</NuxtLink></li>
          <li><NuxtLink to="/blog" class="hover:text-caramel">Blog</NuxtLink></li>
        </ul>
      </div>

      <div>
        <p class="font-semibold text-cream">Kontak</p>
        <ul class="mt-3 space-y-2 text-sm">
          <li v-if="footer?.address">{{ footer.address }}</li>
          <li v-if="footer?.email">
            <a :href="`mailto:${footer.email}`" class="hover:text-caramel">{{ footer.email }}</a>
          </li>
          <li v-if="footer?.phone">{{ footer.phone }}</li>
        </ul>
      </div>
    </div>

    <div class="border-t border-white/10">
      <div class="container-page py-4 text-center text-xs text-cream/60">
        © {{ year }} PT Espresso Italia. Seluruh hak cipta dilindungi.
      </div>
    </div>
  </footer>
</template>
