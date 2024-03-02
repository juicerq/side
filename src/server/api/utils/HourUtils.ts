import { db } from "@/server/db";
import { type ScheduleHour } from "@/server/db/ZSchemasAndTypes";
import { scheduleHours, hoursOnSchedules, schedules } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { takeUniqueOrThrow } from "./DrizzleUtils";

export const HoursUtils = {
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
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "A UUID is required to delete a hour.",
      });

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

    const deletedRelation = await db
      .delete(hoursOnSchedules)
      .where(eq(hoursOnSchedules.hourUuid, uuid))
      .returning()
      .then(takeUniqueOrThrow);

    return {
      deletedHour,
      schedulesAfected: schedulesAfected.map(
        (schedule) => schedule.scheduleUuid
      ),
    };
  },
};
