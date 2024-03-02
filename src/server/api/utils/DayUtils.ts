import { db } from "@/server/db";
import { ScheduleDay } from "@/server/db/ZSchemasAndTypes";
import { hoursOnSchedules, scheduleDays, schedules } from "@/server/db/schema";
import { takeUniqueOrThrow } from "./DrizzleUtils";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const DaysUtils = {
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

    const deletedSchedule = await db
      .delete(schedules)
      .where(eq(schedules.dayUuid, uuid))
      .returning()
      .then(takeUniqueOrThrow);

    const res = await db.transaction(async (tx) => {
      const deletedRelations = await tx
        .delete(hoursOnSchedules)
        .where(eq(hoursOnSchedules.scheduleUuid, deletedSchedule.uuid))
        .returning()
        .then(takeUniqueOrThrow);

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

      return {
        deletedSchedule,
        deletedDay,
      };
    });

    return res;
  },
};
