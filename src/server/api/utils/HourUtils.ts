import { db } from "@/server/db";
import { type ScheduleHour } from "@/server/db/ZSchemasAndTypes";
import { hoursOnSchedules, scheduleHours } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { takeUniqueOrThrow } from "./DrizzleUtils";

export const HoursUtils = {
  async getAll() {
    return await db.select().from(scheduleHours);
  },

  async create({ hour }: ScheduleHour) {
    const pattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!pattern.test(hour)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Hour must be in the format 00:00 to 23:59",
      });
    }

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

    const schedulesAfected = await db.query.hoursOnSchedules.findMany({
      where: eq(hoursOnSchedules.scheduleUuid, uuid),
    });

    return {
      deletedHour,
      schedulesAfected: schedulesAfected.map(
        (schedule) => schedule.scheduleUuid
      ),
    };
  },
};
