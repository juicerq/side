import { db } from "@/server/db";
import {
  type ScheduleDay,
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
import { DaysUtils } from "./DayUtils";
import { HoursUtils } from "./HourUtils";

export const SchedulesUtils = {
  async getAll() {
    const allSchedules = await db.query.schedules.findMany({
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
    });

    return allSchedules;
  },

  async delete({ uuid }: { uuid: string }) {
    if (!uuid)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Uuid is required to delete a schedule.",
      });

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
        message: "Hour Uuids are required to create a schedule.",
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
