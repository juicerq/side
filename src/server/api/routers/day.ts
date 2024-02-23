import { dbSchemas } from "@/server/db/ZSchemasAndTypes";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { SchedulesUtils } from "../utils/SchedulesUtils";
import { z } from "zod";

export const scheduleDaysRouter = createTRPCRouter({
  getAll: adminProcedure.query(async () => {
    return await SchedulesUtils.day.getAll();
  }),

  create: adminProcedure
    .input(dbSchemas.CreateScheduleDaysSchema.pick({ weekDay: true }))
    .output(dbSchemas.CreateScheduleDaysSchema)
    .mutation(async ({ input }) => {
      const newDay = await SchedulesUtils.day.create({
        weekDay: input.weekDay,
      });

      return newDay;
    }),

  delete: adminProcedure
    .input(dbSchemas.CreateScheduleDaysSchema.pick({ weekDay: true }))
    .mutation(async ({ input }) => {
      const deletedDay = await SchedulesUtils.day.delete({
        weekDay: input.weekDay,
      });
    }),
});
