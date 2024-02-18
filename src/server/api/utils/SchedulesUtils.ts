import { db } from "@/server/db";
import { NewTimeInput } from "../routers/schedule";
import { scheduleHours } from "@/server/db/schema";
import { takeUniqueOrThrow } from "./DrizzleUtils";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

export const SchedulesUtils = {
  async newTime({ hour, minute }: NewTimeInput) {
    const parsedHour = Number(hour.toString().length === 1 ? `0${hour}` : hour);

    const alreadyExists = await db
      .select()
      .from(scheduleHours)
      .where(eq(scheduleHours.hourOfDay, `${hour}:${minute ?? "00"}`))
      .then(takeUniqueOrThrow);

    if (alreadyExists)
      return new TRPCError({
        code: "CONFLICT",
        message: "Time already exists.",
      });

    const newTime = await db.insert(scheduleHours).values({
      hourOfDay: `${hour}:${minute ?? "00"}`,
    });

    return {
      success: true,
      newTime,
    };
  },

  times: {
    async getAll() {
      return await db.select().from(scheduleHours);
    },
  },
};
