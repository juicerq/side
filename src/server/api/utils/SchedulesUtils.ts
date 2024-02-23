import { db } from "@/server/db";
import { scheduleDays, scheduleHours } from "@/server/db/schema";
import { takeUniqueOrThrow } from "./DrizzleUtils";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { ScheduleDay, type ScheduleHour } from "@/server/db/ZSchemasAndTypes";

export const SchedulesUtils = {
  hour: {
    async getAll() {
      return await db.select().from(scheduleHours);
    },

    async create({ hour }: ScheduleHour) {
      const alreadyExists = await db
        .select()
        .from(scheduleHours)
        .where(eq(scheduleHours.hour, hour))
        .then(takeUniqueOrThrow);

      if (alreadyExists)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Time already exists.",
        });

      const newHour = await db
        .insert(scheduleHours)
        .values({
          hour: hour,
        })
        .returning()
        .then(takeUniqueOrThrow);

      return newHour;
    },
  },

  day: {
    async getAll() {
      return await db.select().from(scheduleDays);
    },

    async create({ weekDay }: ScheduleDay) {
      const alreadyExists = await db
        .select()
        .from(scheduleDays)
        .where(eq(scheduleDays.weekDay, weekDay))
        .then(takeUniqueOrThrow);

      if (alreadyExists)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Day already exists.",
        });

      const newDay = await db
        .insert(scheduleDays)
        .values({
          weekDay: weekDay,
        })
        .returning()
        .then(takeUniqueOrThrow);

      return newDay;
    },

    async delete({ weekDay }: ScheduleDay) {
      const deletedDay = await db
        .delete(scheduleDays)
        .where(eq(scheduleDays.weekDay, weekDay))
        .returning();
    },
  },
};
