import { inputSchemas } from "@/server/db/ZSchemasAndTypes";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { scheduleDaysRouter } from "./day";
import { scheduleHourRouter } from "./hour";
import { SchedulesUtils } from "../utils/SchedulesUtils";
import { db } from "@/server/db";
import { scheduleDays, scheduleHours, schedules } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const scheduleRouter = createTRPCRouter({
  create: adminProcedure
    .input(z.object({ dayUuid: z.string(), hourUuids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      return await SchedulesUtils.create({
        dayUuid: input.dayUuid,
        hourUuids: input.hourUuids,
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
      const allSchedules = await tx.query.schedules
        .findMany({
          with: {
            day: true,
            hours: {
              with: {
                hourUuid: {
                  columns: {
                    hour: true,
                  },
                },
              },
            },
          },
        })
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
