import type { CreateTRPCProxyClient } from '@trpc/client'
import type { AppRouter } from '../../server/trpc/routers'

declare module '#app' {
  interface NuxtApp {
    $client: CreateTRPCProxyClient<AppRouter>
  }
}

export {}


