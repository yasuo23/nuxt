<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2">
          <ListTodo class="h-5 w-5" />
          <NuxtLink to="/" class="font-semibold tracking-tight">TaskFlow</NuxtLink>
        </div>
        <nav class="flex items-center gap-4 text-sm">
          <NuxtLink to="/login" class="hover:opacity-90">Login</NuxtLink>
          <NuxtLink to="/todos" class="hover:opacity-90">Todos</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4">
      <slot />
    </main>
    <footer class="mx-auto mt-12 max-w-6xl px-4 py-8 text-center text-xs text-muted-foreground">
      © {{ new Date().getFullYear() }} TaskFlow • Built with Nuxt, tRPC, Prisma, shadcn
    </footer>
  </div>
  
</template>

<script setup lang="ts">
import { ListTodo } from 'lucide-vue-next'
</script>


