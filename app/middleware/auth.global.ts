export default defineNuxtRouteMiddleware(async (to) => {
  // Simple guard: require login on /todos
  if (to.path.startsWith('/todos')) {
    const { user, loadSession } = useAuth()
    if (!user.value) {
      await loadSession()
    }
    if (!user.value) {
      return navigateTo('/login?next=' + encodeURIComponent(to.fullPath))
    }
  }
})


