
import { TRPCError } from '@trpc/server';
import { setCookie } from 'h3';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { publicProcedure, protectedProcedure,adminProcedure, router } from '../trpc';
import { users } from '../users';

const JWT_SECRET = 'your-super-secret-jwt-key';

export const authRouter = router({
  // Procedure to get the current user session
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  // Login procedure
  login: publicProcedure
    .input(z.object({ username: z.string() }))
    .mutation(({ ctx, input }) => {
      const user = users.find((u) => u.username === input.username);
      if (!user) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid username' });
      }

      // Create a JWT
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

      // Set the JWT in an HTTPOnly cookie
      setCookie(ctx.event, 'auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600, // 1 hour
      });

      return user;
    }),

  // Logout procedure
  logout: publicProcedure.mutation(({ ctx }) => {
    // Clear the cookie
    setCookie(ctx.event, 'auth-token', '', { maxAge: -1 });
    return { success: true };
  }),
  getSecretMessage: adminProcedure.query(({ ctx }) => {
    return `Hello ADMIN ${ctx.user.name}, this is a top secret message!`;
  }),
  // A protected procedure that only logged-in users can access
//   getSecretMessage: protectedProcedure.query(({ ctx }) => {
//     return `Hello ${ctx.user.name}, this is a secret message!`;
//   }),
});

