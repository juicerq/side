import { db } from "@/server/db";
import { type Schedule } from "@/server/db/ZSchemasAndTypes";
import { hoursOnSchedules, schedules } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { DaysUtils } from "./DayUtils";
import { takeUniqueOrThrow } from "./DrizzleUtils";
import { HoursUtils } from "./HourUtils";

export const SchedulesUtils = {
  async getAll() {
    const allSchedules = await db.query.schedules.findMany({
      with: {
        day: true,
        hours: {
          with: {
            hour: true,
          },
        },
      },
    });

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

    return deletedSchedule;
  },

  async create({
    hourUuids,
    dayUuid,
  }: {
    dayUuid: Schedule["dayUuid"];
    hourUuids: string[];
  }) {
    if (!hourUuids.length)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Array of hour Uuids is required to create a schedule.",
      });

    const newSchedule = await db
      .insert(schedules)
      .values({
        dayUuid,
      })
      .returning()
      .onConflictDoNothing()
      .then(takeUniqueOrThrow);

    const hoursUuids: {
      hourUuid: string;
      scheduleUuid: string;
      createdAt: Date;
      updatedAt: Date | null;
    }[] = [];

    await Promise.all(
      hourUuids.map(async (hourUuid) => {
        const hourRelation = await db
          .insert(hoursOnSchedules)
          .values({
            scheduleUuid: newSchedule.uuid,
            hourUuid,
          })
          .onConflictDoNothing()
          .returning()
          .then(takeUniqueOrThrow);
        hoursUuids.push(hourRelation);
      })
    );

    return {
      newSchedule,
      hoursUuids,
    };
  },

  hour: HoursUtils,

  day: DaysUtils,
};
