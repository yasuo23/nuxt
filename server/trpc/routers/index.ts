
// import { router } from '../trpc';
// import { todoRouter } from './todo'; // Import the new todo router

// // Merge the todo router into the main app router, namespacing it with 'todo.'
// export const appRouter = router({
//   todo: todoRouter,
// });

// export type AppRouter = typeof appRouter;

import { router } from '../trpc';
import { todoRouter } from './todo';
import { authRouter } from './auth'; // Import the auth router

export const appRouter = router({
  todo: todoRouter,
  auth: authRouter, // Add the auth router
});

export type AppRouter = typeof appRouter;