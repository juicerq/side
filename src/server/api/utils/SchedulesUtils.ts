import { db } from "@/server/db";
import {
  ScheduleDay,
  type Schedule,
  type ScheduleHour,
} from "@/server/db/ZSchemasAndTypes";
import {
  hoursOnSchedules,
  scheduleDays,
  scheduleHours,
  schedules,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { takeUniqueOrThrow } from "./DrizzleUtils";

export const SchedulesUtils = {
  async getAll() {
    const allSchedules = await db.query.schedules.findMany(
      {
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
      }
    );

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
      .where(eq(hoursOnSchedules.scheduleUuid, deletedSchedule.uuid))
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

    if (!hourUuids.length) throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Hour Uuids are required to create a schedule.",
    })

    const newSchedule = await db
      .insert(schedules)
      .values({
        dayUuid,
      })
      .returning()
      .onConflictDoNothing()
      .then(takeUniqueOrThrow);

      const hoursUuids: {
        hourUuid: string,
        scheduleUuid: string
        createdAt: Date,
        updatedAt: Date | null
      }[] = []

      await Promise.all(
        hourUuids.map(async (hourUuid) => {
          const hourRelation = await db.insert(hoursOnSchedules).values({
            scheduleUuid: newSchedule.uuid,
            hourUuid,
          }).onConflictDoNothing().returning().then(takeUniqueOrThrow);
          hoursUuids.push(hourRelation)
        }),
      );

    return {
      newSchedule,
      hoursUuids,
    }

  },

  // All Hours Utils
  hour: {
    async getAll() {
      return await db.select().from(scheduleHours);
    },

    async create({ hour }: ScheduleHour) {
      
      const newHour = await db
      .insert(scheduleHours)
      .values({
        hour: hour,
      })
      .returning()
      .onConflictDoNothing()
      .then(takeUniqueOrThrow);
      
      if (!newHour)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Hour already exists or something went wrong.",
        });

      return newHour;
    },

    async delete({ uuid }: { uuid: string }) {
      if (!uuid)
        throw new TRPCError({ code: "BAD_REQUEST", message: "A UUID is required to delete a hour." });

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

  // All Day Utils
  day: {
    async getAll() {
      return await db.select().from(scheduleDays);
    },

    async create({ weekDay }: ScheduleDay) {

      
      const newDay = await db
      .insert(scheduleDays)
      .values({
        weekDay: weekDay,
      })
      .returning()
      .onConflictDoNothing()
      .then(takeUniqueOrThrow);
      
      if (!newDay)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Day already exists or something went wrong.",
        });

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
