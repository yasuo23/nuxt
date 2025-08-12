import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '../../server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>
type User = RouterOutput['auth']['getSession']

export function useAuth() {
  const { $client } = useNuxtApp()
  const user = useState<User>('auth_user', () => null)
  const loading = useState<boolean>('auth_loading', () => false)
  const error = useState<string>('auth_error', () => '')

  const loadSession = async () => {
    try {
      loading.value = true
      user.value = await $client.auth.getSession.query()
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const login = async (username: string) => {
    error.value = ''
    loading.value = true
    try {
      user.value = await $client.auth.login.mutate({ username })
      return true
    } catch (e: any) {
      error.value = e?.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    await $client.auth.logout.mutate()
    user.value = null
  }

  return { user, loading, error, loadSession, login, logout }
}


