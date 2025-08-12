import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  // Nuxt Icon is available if module installed; otherwise we register a simple global component wrapper
  // But since not present, we rely on unplugin-icons via Icon component if available in project
})


