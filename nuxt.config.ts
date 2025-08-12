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
    componentDir: './app/components/ui'
  }, alias :{
    // Point '@' to the app directory so imports like '@/lib/utils' resolve to 'app/lib/utils'
    "@" : fileURLToPath(new URL('./app', import.meta.url)),
    // Optional: root alias if needed
    "#root": fileURLToPath(new URL('./', import.meta.url)),

  },

  nitro: {
    // Avoid bundling Prisma to prevent resolution of internal ".prisma" path
    externals: {
      external: ['@prisma/client', '.prisma/client'],
    },
  }
})