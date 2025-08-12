
// // import { initTRPC } from '@trpc/server';
// // import { prisma } from './prisma'; // Import the prisma client

// // // Create a context that holds the prisma client
// // export const createContext = () => ({
// //   prisma,
// // });

// // // Initialize tRPC with the new context type
// // const t = initTRPC.context<typeof createContext>().create();

// // export const router = t.router;
// // export const publicProcedure = t.procedure;


// import { initTRPC, TRPCError } from '@trpc/server';
// import { H3Event } from 'h3';
// import jwt from 'jsonwebtoken';
// import { prisma } from './prisma';
// import { users } from './users';

// // This is our JWT secret. In a real app, you'd get this from .env
// const JWT_SECRET = 'your-super-secret-jwt-key';

// /**
//  * Creates the tRPC context for each request.
//  * This is where we can access the request, response, and inject dependencies.
//  */
// export const createContext = (event: H3Event) => {
//   // 1. Get the auth token from the cookie
//   const authToken = getCookie(event, 'auth-token');
//   let user = null;

//   if (authToken) {
//     try {
//       // 2. Verify the token
//       const decoded = jwt.verify(authToken, JWT_SECRET) as { id: string };
//       // 3. Find the user based on the token's payload
//       user = users.find((u) => u.id === decoded.id) || null;
//     } catch (e) {
//       // Token is invalid or expired
//       user = null;
//     }
//   }

//   // 4. Return the context
//   return {
//     prisma,
//     event, // Pass the event to set cookies in mutations
//     user,  // The user object (or null)
//   };
// };

// // Create the context type
// type Context = ReturnType<typeof createContext>;

// // Initialize tRPC
// const t = initTRPC.context<Context>().create();

// export const router = t.router;
// export const publicProcedure = t.procedure;

// /**
//  * Middleware to check if the user is authenticated.
//  * This is the gatekeeper for our private routes.
//  */
// const isAuthed = t.middleware(({ ctx, next }) => {
//   if (!ctx.user) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' });
//   }
//   return next({
//     ctx: {
//       // Infers the `user` as non-nullable in protected procedures
//       user: ctx.user,
//     },
//   });
// });

// /**
//  * This is the procedure you'll use for any route that requires a logged-in user.
//  */
// export const protectedProcedure = t.procedure.use(isAuthed);


import { initTRPC, TRPCError } from '@trpc/server';
import { H3Event, getCookie } from 'h3';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import { users } from './users';

// --- No changes to JWT_SECRET or createContext ---
const JWT_SECRET = 'your-super-secret-jwt-key';

// The createContext function already attaches the full user object (including the new 'role' field),
// so no changes are needed here. It works as is.
export const createContext = (event: H3Event) => {
  const authToken = getCookie(event, 'auth-token');
  let user = null;
  if (authToken) {
    try {
      const decoded = jwt.verify(authToken, JWT_SECRET) as { id: string };
      user = users.find((u) => u.id === decoded.id) || null;
    } catch (e) {
      user = null;
    }
  }
  return { prisma, event, user };
};

type Context = ReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// --- isAuthed middleware for any logged-in user (no change here) ---
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: { user: ctx.user },
  });
});

// --- NEW: isAdmin middleware for admin users only ---
const isAdmin = t.middleware(({ ctx, next }) => {
  // First, check if the user is even logged in.
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in to do this.' });
  }
  // Next, check if the logged-in user has the 'admin' role.
  if (ctx.user.role !== 'admin') {
    // The user is authenticated, but not authorized for this action.
    // FORBIDDEN is the correct error code for this.
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have permission to do this.' });
  }
  // If both checks pass, proceed.
  return next({
    ctx: { user: ctx.user },
  });
});

// --- Procedure Definitions ---
// For any logged-in user
export const protectedProcedure = t.procedure.use(isAuthed);
// NEW: For admin users ONLY
export const adminProcedure = t.procedure.use(isAdmin);

