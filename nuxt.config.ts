// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-06-01',
  devtools: { enabled: true },

  // SSR stays ON — important for SEO and the Nitro `vercel` preset (auto-detected on Vercel).
  ssr: true,

  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/tailwind.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'Espresso Italia',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Distributor mesin kopi, mesin gelato, dan peralatan dapur HoReCa di Indonesia.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700;800&display=swap',
        },
      ],
    },
  },

  typescript: {
    strict: true,
    // Keep type-checking out of the dev/build hot path for the prototype.
    typeCheck: false,
  },

  // Server-only secrets are read from the environment (see .env.example).
  runtimeConfig: {
    sessionPassword: process.env.NUXT_SESSION_PASSWORD,
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
    public: {},
  },
})
