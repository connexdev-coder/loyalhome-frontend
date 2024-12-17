export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@nuxt/icon",
  ],

  i18n: {
    defaultLocale: "kr",
    langDir: "locales",
    locales: [
      { code: "kr", file: "kr.json", dir: "rtl" },
      { code: "ar", file: "ar.json", dir: "rtl" },
      { code: "en", file: "en.json", dir: "ltr" },
    ],
    strategy: "no_prefix",
    detectBrowserLanguage: {
      alwaysRedirect: true,
      redirectOn: "all",
      useCookie: true,
      cookieCrossOrigin: false,
      cookieDomain: null,
      cookieKey: "language",
      cookieSecure: true,
    },
    vueI18n: "./i18n.config.ts",
  },

  experimental: {
    typedPages: true,
  },

  css: ["~/assets/css/main.css", "~/assets/css/global.css"],

  runtimeConfig: {
    tokenSecret: process.env.SECRET,
    public: {
      api_url: process.env.API,
    },
  },
});