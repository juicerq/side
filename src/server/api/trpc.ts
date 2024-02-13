/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError, z } from "zod";

import { db } from "@/server/db";
import { getUser } from "./utils/getUser";
import { verifyToken } from "./utils/trpcUtils";
/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

const frontError = z.object({
  data: z.any(),
});

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const allCookies = opts.headers.get("Cookie");

  const accessTokenCookie = allCookies
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("access_token="));

  const token = accessTokenCookie?.split("=")[1];

  const userUuid = verifyToken(token);

  const res = await getUser({ userUuid });

  return {
    db,
    ...opts,
    user: res?.user,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    const message =
      error.cause instanceof ZodError
        ? error.cause.errors.map((e) => `${e.path[0]} ${e.message}`).join(", ")
        : error.message;

    const parsedCause = frontError.safeParse(error.cause);

    return {
      ...shape,
      message,
      data: {
        ...shape.data,
        stack: parsedCause.success ? parsedCause.data.data : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */

export const publicProcedure = t.procedure;
export const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!ctx.user.isAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});
