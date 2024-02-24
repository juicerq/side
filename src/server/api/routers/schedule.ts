import { inputSchemas } from "@/server/db/ZSchemasAndTypes";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { scheduleDaysRouter } from "./day";
import { scheduleHourRouter } from "./hour";
import { SchedulesUtils } from "../utils/SchedulesUtils";
import { db } from "@/server/db";
import { scheduleDays, scheduleHours, schedules } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const scheduleRouter = createTRPCRouter({
  create: adminProcedure
    .input(inputSchemas.schedule)
    .mutation(async ({ input }) => {
      return await SchedulesUtils.create({
        scheduleHourUuid: input.scheduleHourUuid,
        scheduleDayUuid: input.scheduleDayUuid,
      });
    }),

  delete: adminProcedure
    .input(inputSchemas.schedule.pick({ uuid: true }))
    .mutation(async ({ input }) => {
      if (!input.uuid)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Uuid is required.",
        });

      return await SchedulesUtils.delete({
        uuid: input.uuid,
      });
    }),

  getAll: adminProcedure.query(async () => {
    const res = await db.transaction(async (tx) => {
      const allSchedules = await tx
        .select()
        .from(schedules)
        .leftJoin(
          scheduleHours,
          eq(schedules.scheduleHourUuid, scheduleHours.uuid),
        )
        .leftJoin(
          scheduleDays,
          eq(schedules.scheduleDayUuid, scheduleDays.uuid),
        )
        .execute();

      const hoursOptions = await SchedulesUtils.hour.getAll();
      const daysOptions = await SchedulesUtils.day.getAll();

      return {
        allSchedules,
        hoursOptions,
        daysOptions,
      };
    });

    return res;
  }),

  hour: scheduleHourRouter,

  day: scheduleDaysRouter,
});
