import { inputSchemas, outputSchemas } from "@/server/db/ZSchemasAndTypes";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { SchedulesUtils } from "../utils/SchedulesUtils";
import { TRPCError } from "@trpc/server";

export const scheduleHourRouter = createTRPCRouter({
  getAll: adminProcedure.query(async () => {
    return await SchedulesUtils.hour.getAll();
  }),

  create: adminProcedure
    .input(inputSchemas.scheduleHour)
    .output(outputSchemas.scheduleHour)
    .mutation(async ({ input }) => {
      return await SchedulesUtils.hour.create({
        hour: input.hour,
      });
    }),

  delete: adminProcedure
    .input(inputSchemas.scheduleHour.pick({ uuid: true }))
    .output(outputSchemas.scheduleHour)
    .mutation(async ({ input }) => {
      if (!input.uuid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Uuid is required.",
        });
      }
      return await SchedulesUtils.hour.delete({
        uuid: input.uuid,
      });
    }),
});
