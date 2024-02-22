import { dbSchemas } from "@/server/db/SchemasAndTypes";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { SchedulesUtils } from "../utils/SchedulesUtils";

export const scheduleDaysRouter = createTRPCRouter({
  getAll: adminProcedure.query(async () => {
    return await SchedulesUtils.day.getAll();
  }),

  create: adminProcedure
    .input(dbSchemas.CreateScheduleDaysSchema.pick({ dayOfWeek: true }))
    .mutation(async ({ input }) => {
      await SchedulesUtils.day.create({
        dayOfWeek: input.dayOfWeek,
      });
    }),
});
