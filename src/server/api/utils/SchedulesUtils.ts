import { db } from "@/server/db";
import { scheduleDays, scheduleHours, schedules } from "@/server/db/schema";
import { takeUniqueOrThrow } from "./DrizzleUtils";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import {
  ScheduleDay,
  type ScheduleHour,
  type Schedule,
} from "@/server/db/ZSchemasAndTypes";

export const SchedulesUtils = {
  async getAll() {
    const allSchedules = await db.select().from(schedules);

    return allSchedules;
  },

  async create({ scheduleHourUuid, scheduleDayUuid }: Schedule) {
    const alreadyExist = await db
      .select()
      .from(schedules)
      .where(
        and(
          eq(schedules.scheduleDayUuid, scheduleDayUuid),
          eq(schedules.scheduleHourUuid, scheduleHourUuid),
        ),
      )
      .then(takeUniqueOrThrow);

    if (alreadyExist)
      throw new TRPCError({
        code: "CONFLICT",
        message: "Schedule already exists.",
      });

    const newSchedule = await db
      .insert(schedules)
      .values({
        scheduleDayUuid,
        scheduleHourUuid,
      })
      .returning()
      .then(takeUniqueOrThrow);

    if (!newSchedule) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error when creating schedule.",
      });
    }

    return newSchedule;
  },

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

    async delete({ uuid }: { uuid: ScheduleHour["uuid"] }) {
      if (!uuid)
        throw new TRPCError({ code: "BAD_REQUEST", message: "Missing uuid." });

      const deletedHour = await db
        .delete(scheduleHours)
        .where(eq(scheduleHours.uuid, uuid))
        .returning()
        .then(takeUniqueOrThrow);

      if (!deletedHour)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error when deleting hour.",
        });

      return deletedHour;
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

    async delete({ uuid }: { uuid: ScheduleDay["uuid"] }) {
      if (!uuid)
        throw new TRPCError({ code: "BAD_REQUEST", message: "Missing uuid." });

      const deletedDay = await db
        .delete(scheduleDays)
        .where(eq(scheduleDays.uuid, uuid))
        .returning()
        .then(takeUniqueOrThrow);

      if (!deletedDay)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error when deleting day.",
        });

      return deletedDay;
    },
  },
};
