import { inputSchemas, outputSchemas } from "@/server/db/ZSchemasAndTypes";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { SchedulesUtils } from "../utils/SchedulesUtils";

export const scheduleDaysRouter = createTRPCRouter({
  getAll: adminProcedure.query(async () => {
    return await SchedulesUtils.day.getAll();
  }),

  create: adminProcedure
    .input(inputSchemas.scheduleDay.pick({ weekDay: true }))
    .output(outputSchemas.scheduleDay)
    .mutation(async ({ input }) => {
      return await SchedulesUtils.day.create({
        weekDay: input.weekDay,
      });
    }),

  delete: adminProcedure
    .input(inputSchemas.scheduleDay.pick({ uuid: true }).strict())
    .output(outputSchemas.scheduleDay)
    .mutation(async ({ input }) => {
      return await SchedulesUtils.day.delete({
        uuid: input.uuid,
      });
    }),
});
