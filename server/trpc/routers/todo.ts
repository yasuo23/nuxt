
// import { z } from 'zod';
// import { publicProcedure, router } from '../trpc';

// export const todoRouter = router({
//   // READ all todos
//   getTodos: publicProcedure.query(({ ctx }) => {
//     return ctx.prisma.todo.findMany({ orderBy: { createdAt: 'asc' } });
//   }),

//   // CREATE a new todo
//   addTodo: publicProcedure
//     .input(z.object({ text: z.string().min(1) }))
//     .mutation(async ({ ctx, input }) => {
//       return await ctx.prisma.todo.create({
//         data: {
//           text: input.text,
//         },
//       });
//     }),

//   // UPDATE the completed status of a todo
//   setCompleted: publicProcedure
//     .input(z.object({ id: z.string(), completed: z.boolean() }))
//     .mutation(async ({ ctx, input }) => {
//       return await ctx.prisma.todo.update({
//         where: { id: input.id },
//         data: { completed: input.completed },
//       });
//     }),

//   // DELETE a todo
//   deleteTodo: publicProcedure
//     .input(z.object({ id: z.string() }))
//     .mutation(async ({ ctx, input }) => {
//       return await ctx.prisma.todo.delete({
//         where: { id: input.id },
//       });
//     }),
// });

import { z } from 'zod';
// Import protectedProcedure instead of publicProcedure for mutations
import { publicProcedure, protectedProcedure, router } from '../trpc';

export const todoRouter = router({
  // READ all todos - This can remain public
  getTodos: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({ orderBy: { createdAt: 'asc' } });
  }),

  // CREATE a new todo - This is now a protected route
  addTodo: protectedProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.todo.create({
        data: { text: input.text },
      });
    }),

  // UPDATE a todo - Protected
  setCompleted: protectedProcedure
    .input(z.object({ id: z.string(), completed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.todo.update({
        where: { id: input.id },
        data: { completed: input.completed },
      });
    }),

  // DELETE a todo - Protected
  deleteTodo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.todo.delete({
        where: { id: input.id },
      });
    }),
});