// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  ssr: false,
  runtimeConfig: {
    public: {
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      }
    },
  },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
    'vuetify-nuxt-module',
    '@nuxtjs/i18n',
    '@nuxt/image'
  ],

  i18n: {
    strategy: 'no_prefix',
    langDir: 'locales',
    defaultLocale: 'en',

    locales: [
      { code: 'en', name: 'English', file: 'en.ts' },
      { code: 'es', name: 'Español', file: 'es.ts' },
      { code: 'fr', name: 'Français', file: 'fr.ts' }
    ]
  },
  app: {
    head: {
      script: [
        {
          src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`,
          async: true,
          defer: true,
        }
      ]
    }
  },
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      /* vuetify options */
    }
  },
  nitro: {
    experimental: {
      openAPI: true
    }
  },
  devtools: {
    enabled: true,
    vscode: {
      reuseExistingServer: true,
      port: 3090
    }
  },
})