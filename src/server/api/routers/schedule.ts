import { inputSchemas } from "@/server/db/ZSchemasAndTypes";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { scheduleDaysRouter } from "./day";
import { scheduleHourRouter } from "./hour";

export const scheduleRouter = createTRPCRouter({
  create: publicProcedure
    .input(inputSchemas.schedule)
    .mutation(async ({ input }) => {
      console.log("input:", input);
    }),

  hour: scheduleHourRouter,

  day: scheduleDaysRouter,
});
