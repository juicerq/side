import { db } from "@/server/db";
import { ScheduleDay } from "@/server/db/ZSchemasAndTypes";
import { scheduleDays } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { takeUniqueOrThrow } from "./DrizzleUtils";

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

  async delete({ uuid }: { uuid: string }) {
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
};
