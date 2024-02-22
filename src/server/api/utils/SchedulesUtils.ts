import { db } from "@/server/db";
import { scheduleDays, scheduleHours } from "@/server/db/schema";
import { takeUniqueOrThrow } from "./DrizzleUtils";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { ScheduleDay, type ScheduleHour } from "@/server/db/SchemasAndTypes";

export const SchedulesUtils = {
  time: {
    async getAll() {
      return await db.select().from(scheduleHours);
    },

    async create({ hourOfDay }: ScheduleHour) {
      const alreadyExists = await db
        .select()
        .from(scheduleHours)
        .where(eq(scheduleHours.hourOfDay, hourOfDay))
        .then(takeUniqueOrThrow);

      if (alreadyExists)
        return new TRPCError({
          code: "CONFLICT",
          message: "Time already exists.",
        });

      const newHour = await db.insert(scheduleHours).values({
        hourOfDay: hourOfDay,
      });

      return {
        success: true,
        newHour,
      };
    },
  },

  day: {
    async getAll() {
      return await db.select().from(scheduleDays);
    },

    async create({ dayOfWeek }: ScheduleDay) {
      const alreadyExists = await db
        .select()
        .from(scheduleDays)
        .where(eq(scheduleDays.dayOfWeek, dayOfWeek))
        .then(takeUniqueOrThrow);

      if (alreadyExists)
        return new TRPCError({
          code: "CONFLICT",
          message: "Day already exists.",
        });

      const newDay = await db.insert(scheduleDays).values({
        dayOfWeek: dayOfWeek,
      });

      return {
        success: true,
        newDay,
      };
    },
  },
};
