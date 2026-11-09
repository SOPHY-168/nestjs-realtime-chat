export default defineNuxtConfig({
  compatibilityDate: '2026-11-05',

  devtools: {
    enabled: true,
  },

  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE ||
        'http://localhost:8000/api',
    },
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },

  app: {
    head: {
      title: 'NestJS Real-Time Chat',
      meta: [
        {
          name: 'description',
          content: 'Real-time chat using NestJS and Nuxt 4',
        },
      ],
    },
  },
});