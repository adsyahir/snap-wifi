// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["shadcn-nuxt"],
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('snapwifi-color-mode')||'light';document.documentElement.classList[t==='dark'?'add':'remove']('dark')}catch(e){}})()`,
          type: 'text/javascript',
        },
      ],
    },
  },
});
