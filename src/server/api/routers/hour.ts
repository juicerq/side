import { inputSchemas, outputSchemas } from "@/server/db/ZSchemasAndTypes";
import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { SchedulesUtils } from "../utils/SchedulesUtils";

export const scheduleHourRouter = createTRPCRouter({
  getAll: adminProcedure.query(async () => {
    return await SchedulesUtils.hour.getAll();
  }),

  create: adminProcedure
    .input(inputSchemas.scheduleHour.pick({ hour: true }))
    .output(outputSchemas.scheduleHour)
    .mutation(async ({ input }) => {
      return await SchedulesUtils.hour.create({
        hour: input.hour,
      });
    }),

  delete: adminProcedure
    .input(inputSchemas.scheduleHour.pick({ uuid: true }).required())
    .output(
      z.object({
        deletedHour: outputSchemas.scheduleHour,
        schedulesAfected: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      return await SchedulesUtils.hour.delete({
        uuid: input.uuid,
      });
    }),
});
