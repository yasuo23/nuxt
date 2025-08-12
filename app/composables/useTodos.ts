import { ref, computed } from 'vue'
import { TRPCClientError } from '@trpc/client'
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '../../server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>
type Todo = RouterOutput['todo']['getTodos'][number]

export function useTodos() {
  const { $client } = useNuxtApp()

  const todos = useState<Todo[]>('todos_items', () => [])
  const loading = useState<boolean>('todos_loading', () => false)
  const error = useState<string>('todos_error', () => '')
  const newText = useState<string>('todos_new_text', () => '')

  const completedCount = computed(() => todos.value.filter(t => t.completed).length)
  const activeCount = computed(() => todos.value.filter(t => !t.completed).length)

  const handleError = (err: unknown) => {
    if (err instanceof TRPCClientError) return err.message
    return 'An unknown error occurred.'
  }

  const fetchTodos = async () => {
    loading.value = true
    try {
      todos.value = await $client.todo.getTodos.query()
    } finally {
      loading.value = false
    }
  }

  const addTodo = async () => {
    const text = newText.value.trim()
    if (!text) return
    error.value = ''
    loading.value = true
    try {
      await $client.todo.addTodo.mutate({ text })
      newText.value = ''
      await fetchTodos()
    } catch (e) {
      error.value = handleError(e)
    } finally {
      loading.value = false
    }
  }

  const toggle = async (todo: Todo) => {
    error.value = ''
    try {
      await $client.todo.setCompleted.mutate({ id: todo.id, completed: !todo.completed })
      await fetchTodos()
    } catch (e) {
      error.value = handleError(e)
    }
  }

  const remove = async (todo: Todo) => {
    error.value = ''
    try {
      await $client.todo.deleteTodo.mutate({ id: todo.id })
      await fetchTodos()
    } catch (e) {
      error.value = handleError(e)
    }
  }

  return {
    todos,
    loading,
    error,
    newText,
    completedCount,
    activeCount,
    fetchTodos,
    addTodo,
    toggle,
    remove,
  }
}


