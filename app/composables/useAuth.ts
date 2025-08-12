import { ref, onMounted } from 'vue'
import { TRPCClientError } from '@trpc/client'
import type { inferRouterOutputs } from '@trpc/server'

type RouterOutput = inferRouterOutputs<AppRouter>
type User = RouterOutput['auth']['getSession']

export const useAuth = () => {
  const { $client } = useNuxtApp()

  // --- STATE ---
  const user = ref<User>(null)
  const username = ref('')
  const authError = ref('')

  const secretMessage = ref('')
  const secretMessageError = ref('')

  const newTodoText = ref('')
  const todoError = ref('')
  const { data: todos, refresh: refreshTodos } = useAsyncData('todos', () =>
    $client.todo.getTodos.query()
  )

  // --- HELPERS ---
  const handleTrpcError = (err: unknown) => {
    if (err instanceof TRPCClientError) return err.message
    return 'An unknown error occurred.'
  }

  // --- AUTH ---
  const fetchSession = async () => {
    try {
      user.value = await $client.auth.getSession.query()
    } catch {
      user.value = null
    }
  }

  const login = async () => {
    if (!username.value) return
    authError.value = ''
    try {
      user.value = await $client.auth.login.mutate({ username: username.value })
    } catch (err) {
      authError.value = handleTrpcError(err)
    }
  }

  const logout = async () => {
    await $client.auth.logout.mutate()
    user.value = null
    secretMessage.value = ''
    secretMessageError.value = ''
  }

  // --- SECRET MESSAGE ---
  const fetchSecretMessage = async () => {
    secretMessageError.value = ''
    secretMessage.value = ''
    try {
      secretMessage.value = await $client.auth.getSecretMessage.query()
    } catch (err) {
      secretMessageError.value = handleTrpcError(err)
    }
  }

  // --- TODOS ---
  const addTodo = async () => {
    if (newTodoText.value.trim() === '') return
    todoError.value = ''
    try {
      await $client.todo.addTodo.mutate({ text: newTodoText.value })
      newTodoText.value = ''
      await refreshTodos()
    } catch (err) {
      todoError.value = handleTrpcError(err)
    }
  }

  // --- INIT ---
  onMounted(fetchSession)

  return {
    // State
    user,
    username,
    authError,
    secretMessage,
    secretMessageError,
    newTodoText,
    todoError,
    todos,

    // Actions
    fetchSession,
    login,
    logout,
    fetchSecretMessage,
    addTodo,
  }
}
