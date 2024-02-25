import { db } from "@/server/db";
import {
  hoursOnSchedules,
  scheduleDays,
  scheduleHours,
  schedules,
} from "@/server/db/schema";
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

  async delete({ uuid }: { uuid: string }) {
    const deletedSchedule = await db
      .delete(schedules)
      .where(eq(schedules.uuid, uuid))
      .returning()
      .then(takeUniqueOrThrow);

    if (!deletedSchedule) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error when deleting schedule.",
      });
    }

    const deletedHoursOnSchedules = await db
      .delete(hoursOnSchedules)
      .where(eq(hoursOnSchedules.scheduleUuid, uuid))
      .returning();

    return {
      deletedSchedule,
      deletedHoursOnSchedules,
    };
  },

  async create({
    hourUuids,
    dayUuid,
  }: {
    dayUuid: Schedule["dayUuid"];
    hourUuids: string[];
  }) {
    const alreadyExist = await db
      .select()
      .from(schedules)
      .where(and(eq(schedules.dayUuid, dayUuid)))
      .then(takeUniqueOrThrow);

    if (alreadyExist)
      throw new TRPCError({
        code: "CONFLICT",
        message: "Schedule with this day already exists.",
      });

    const newSchedule = await db
      .insert(schedules)
      .values({
        dayUuid,
      })
      .returning()
      .then(takeUniqueOrThrow);

    if (hourUuids.length) {
      await Promise.all(
        hourUuids.map(async (hourUuid) => {
          await db.insert(hoursOnSchedules).values({
            scheduleUuid: newSchedule.uuid,
            hourUuid,
          });
        }),
      );
    }

    if (!newSchedule) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal error when creating schedule.",
      });
    }

    const completeSchedule = await db.query.schedules.findFirst({
      where: eq(schedules.uuid, newSchedule.uuid),
      with: {
        day: true,
        hours: true,
      },
    });

    return completeSchedule;
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
          message: "Hour already exists.",
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

    async delete({ uuid }: { uuid: string }) {
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
