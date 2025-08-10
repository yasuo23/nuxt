

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../server/trpc/routers';

export default defineNuxtPlugin((): any => {
  /**
   * Function to get the base URL for the tRPC client.
   *
   * On the server, it uses the request headers to build the full URL.
   * On the client, it's an empty string, allowing for relative paths.
   */
  const getBaseUrl = (): string => {
    // If this is running on the server, we need a full URL.
    if (process.server) {
      // Access the Nuxt request object to get the host.
      const nuxtApp = useNuxtApp();
      const req: any = nuxtApp.ssrContext?.event.node.req;
      const host: string = req?.headers['host'] ?? 'localhost:3000';
      return `http://${host}`;
    }
    // On the client, we can use a relative path.
    return '';
  };

  const client: any = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        // The URL is now dynamically set based on the environment.
        url: `${getBaseUrl()}/api/trpc`,
      }),
    ],
  });

  return {
    provide: {
      client,
    },
  };
});

