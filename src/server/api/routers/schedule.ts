import { db } from "@/server/db";
import { inputSchemas } from "@/server/db/ZSchemasAndTypes";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { SchedulesUtils } from "../utils/SchedulesUtils";
import { scheduleDaysRouter } from "./day";
import { scheduleHourRouter } from "./hour";

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
    .input(inputSchemas.schedule.pick({ uuid: true }).required())
    .mutation(async ({ input }) => {
      return await SchedulesUtils.delete({
        uuid: input.uuid,
      });
    }),

  getAll: publicProcedure.query(() => {
    return SchedulesUtils.getAll();
  }),

  getAllWithOptions: adminProcedure.query(async () => {
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
