import { userRouter } from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";
import { appointmentRouter } from "./routers/appointment";
import { scheduleRouter } from "./routers/schedule";
import { testeRouter } from "./routers/teste";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  schedule: scheduleRouter,
  appointment: appointmentRouter,
  teste: testeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
