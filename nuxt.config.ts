// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
import  {fileURLToPath} from 'node:url'                                          
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  build: {
    transpile: ['trpc-nuxt']
  },

  css: ['./app/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['shadcn-nuxt'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  }, alias :{
    "@" : fileURLToPath(new URL('./', import.meta.url)),

  }
})