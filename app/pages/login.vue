<template>
  <div class="grid min-h-[80vh] grid-cols-1 lg:grid-cols-2">
    <div class="flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white p-10">
      <div class="max-w-md">
        <img src="/hero-todo.svg" alt="Tasks" class="mb-6 w-full rounded-2xl shadow-sm" />
        <h1 class="mb-2 text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p class="mb-8 text-muted-foreground">Sign in to manage your tasks efficiently.</p>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li class="flex items-center gap-2"><CheckCircle2 class="text-emerald-600" /> Clean UI powered by shadcn</li>
          <li class="flex items-center gap-2"><Shield class="text-emerald-600" /> JWT auth via tRPC</li>
          <li class="flex items-center gap-2"><ListTodo class="text-emerald-600" /> Add, toggle, and delete todos</li>
        </ul>
      </div>
    </div>

    <div class="flex items-center justify-center p-10">
      <div class="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-sm">
        <form @submit.prevent="onLogin" class="space-y-5">
          <div class="space-y-2">
            <Label>Username</Label>
            <Input v-model="username" placeholder="admin or user" />
          </div>
          <Button type="submit" class="w-full">Continue</Button>
          <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
        </form>

        <div v-if="user" class="mt-6 rounded-md border p-3 text-sm">
          Logged in as <b>{{ user.name }}</b> ({{ user.role }})
        </div>

        <div class="mt-6 flex items-center justify-between text-sm">
          <NuxtLink to="/todos" class="underline">Go to Todos</NuxtLink>
          <Button v-if="user" variant="outline" @click="onLogout">Logout</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TRPCClientError } from '@trpc/client'
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '../../server/trpc/routers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Shield, ListTodo } from 'lucide-vue-next'

type RouterOutput = inferRouterOutputs<AppRouter>
type User = RouterOutput['auth']['getSession']

const { $client } = useNuxtApp()
const username = ref('')
const user = ref<User>(null)
const error = ref('')

const handleError = (err: unknown) => {
  if (err instanceof TRPCClientError) return err.message
  return 'An unknown error occurred.'
}

const loadSession = async () => {
  try {
    user.value = await $client.auth.getSession.query()
  } catch {
    user.value = null
  }
}

const onLogin = async () => {
  error.value = ''
  try {
    user.value = await $client.auth.login.mutate({ username: username.value || 'user' })
    await navigateTo('/todos')
  } catch (e) {
    error.value = handleError(e)
  }
}

const onLogout = async () => {
  await $client.auth.logout.mutate()
  user.value = null
}

onMounted(loadSession)
</script>

<style scoped>
</style>


