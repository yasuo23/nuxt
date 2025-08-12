<template>
  <div class="mx-auto max-w-3xl py-10">
    <div class="mb-8 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <ListTodo class="h-6 w-6 text-emerald-600" />
        <h1 class="text-2xl font-semibold">Todos</h1>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink class="text-sm underline" to="/login">Login</NuxtLink>
        <Button variant="outline" @click="logout" v-if="user">Logout</Button>
      </div>
    </div>

    <div v-if="!user" class="mb-6 rounded-md border p-3 text-sm">
      You must be logged in to add/update/delete todos. View only is public.
    </div>

    <form @submit.prevent="addTodo" class="mb-6 flex gap-2">
      <Input
        v-model="newText"
        placeholder="What needs to be done?"
        :disabled="!user"
      />
      <Button type="submit" :disabled="!user">Add</Button>
    </form>

    <p v-if="error" class="mb-4 text-sm text-destructive">{{ error }}</p>

    <Card>
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge>{{ completedCount }} done</Badge>
          <Badge>{{ activeCount }} left</Badge>
        </div>
      </div>
      <ul class="divide-y rounded-md border">
      <li v-for="todo in todos" :key="todo.id" class="flex items-center gap-3 p-3">
        <input type="checkbox" class="accent-emerald-600" :checked="todo.completed" :disabled="!user" @change="toggle(todo)" />
        <span class="flex-1" :class="{ 'line-through text-muted-foreground': todo.completed }">{{ todo.text }}</span>
        <Button variant="destructive" size="sm" @click="remove(todo)" :disabled="!user">
          <Trash2 class="mr-1 h-4 w-4" /> Delete
        </Button>
      </li>
      </ul>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ListTodo, Trash2 } from 'lucide-vue-next'

import type { inferRouterOutputs } from '@trpc/server'
type RouterOutput = inferRouterOutputs<AppRouter>
type User = RouterOutput['auth']['getSession']

const { $client } = useNuxtApp()
const user = useState<User>('todos_user', () => null)
const { todos, newText, error, completedCount, activeCount, fetchTodos, addTodo, toggle, remove } = useTodos()

const loadUser = async () => {
  try { user.value = await $client.auth.getSession.query() } catch { user.value = null }
}

const logout = async () => {
  await $client.auth.logout.mutate()
  await loadUser()
}

onMounted(async () => {
  await Promise.all([loadUser(), fetchTodos()])
})
</script>

<style scoped>
.text-muted-foreground { color: #6b7280 }
</style>


