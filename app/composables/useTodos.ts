
// import { ref } from 'vue';
// import type { inferRouterOutputs } from '@trpc/server';
// import type { AppRouter } from '../../server/trpc/routers';

// // This is a special Nuxt composable that gives us access to the app instance.
// import { useNuxtApp } from '#app';

// // Infer types from the router to get full end-to-end type safety.
// type RouterOutput = inferRouterOutputs<AppRouter>;
// type Todo = RouterOutput['todo']['getTodos'][number];

// // The name 'useTodos' is a convention for composables.
// export const useTodos = () => {
//   const { $client } = useNuxtApp();

//   // Fetch the initial list of todos. useAsyncData handles SSR and client-side fetching.
//   const { data: todos, pending, error, refresh } = useAsyncData(
//     'todos', // A unique key for this data fetch
//     () => $client.todo.getTodos.query()
//   );

//   // A helper function for showing feedback to the user.
//   const showToast = (title: string, description: string) => {
//     const { $toast } = useNuxtApp();
//     $toast({ title, description });
//   };

//   // CREATE operation
//   const addTodo = async (text: string) => {
//     if (text.trim() === '') return;
//     try {
//       await $client.todo.addTodo.mutate({ text });
//       await refresh(); // Re-fetch the list to show the new todo
//       showToast('Success', 'A new todo has been added.');
//     } catch (err: any) {
//       showToast('Error', err.message);
//     }
//   };

//   // UPDATE operation
//   const toggleCompleted = async (todo: Todo) => {
//     try {
//       await $client.todo.setCompleted.mutate({ id: todo.id, completed: !todo.completed });
//       await refresh(); // Re-fetch to show the updated state
//     } catch (err: any) {
//       showToast('Error', err.message);
//     }
//   };

//   // DELETE operation
//   const deleteTodo = async (id: string) => {
//     try {
//       await $client.todo.deleteTodo.mutate({ id });
//       await refresh(); // Re-fetch to show the item has been removed
//       showToast('Success', 'The todo was deleted.');
//     } catch (err: any) {
//       showToast('Error', err.message);
//     }
//   };

//   // Expose all the state and methods to be used by the component.
//   return {
//     todos,
//     pending,
//     error,
//     addTodo,
//     toggleCompleted,
//     deleteTodo,
//   };
// };

