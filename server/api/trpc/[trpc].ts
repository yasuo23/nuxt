
// import { appRouter } from '../../trpc/routers';


// import { createNuxtApiHandler } from 'trpc-nuxt';
// import { createContext } from '../../trpc/trpc'; // Import the context factory

// export default createNuxtApiHandler({
//   router: appRouter,
//   createContext, // Provide the context factory here
// });
import { createNuxtApiHandler } from 'trpc-nuxt';
import { appRouter } from '../../trpc/routers';
import { createContext } from '../../trpc/trpc'; // Make sure you import the new context

export default createNuxtApiHandler({
  router: appRouter,
  createContext, // And provide it here
});