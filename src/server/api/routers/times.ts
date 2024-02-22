import { dbSchemas } from "@/server/db/SchemasAndTypes";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { SchedulesUtils } from "../utils/SchedulesUtils";

export const scheduleTimesRouter = createTRPCRouter({
  getAll: adminProcedure.query(async () => {
    return await SchedulesUtils.time.getAll();
  }),

  create: adminProcedure
    .input(dbSchemas.CreateScheduleHourSchema)
    .mutation(async ({ input }) => {
      await SchedulesUtils.time.create({
        hourOfDay: input.hourOfDay,
      });
    }),
});
