import { db } from "@/server/db";
import { Appointment } from "@/server/db/ZSchemasAndTypes";
import { appointments } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { asc, eq, sql } from "drizzle-orm";
import { takeUniqueOrThrow } from "./DrizzleUtils";

export const AppointmentUtils = {
  async getAll() {
    const allAppointments = await db.query.appointments.findMany({
      with: {
        user: true,
        schedule: true,
        hour: true,
      },
    });

    return allAppointments;
  },

  async create({
    userUuid,
    scheduleUuid,
    hourUuid,
    observations,
    status,
    date,
  }: Appointment) {
    const alreadyExist = await db
      .select()
      .from(appointments)
      .where(eq(appointments.date, date))
      .then(takeUniqueOrThrow);

    if (alreadyExist)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Appointment already exists or something went wrong.",
      });

    const newAppointment = await db
      .insert(appointments)
      .values({
        userUuid,
        scheduleUuid,
        hourUuid,
        observations,
        status: status ?? "scheduled",
        date,
      })
      .returning()
      .then(takeUniqueOrThrow);

    if (!newAppointment)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Appointment already exists or something went wrong.",
      });

    return newAppointment;
  },

  async delete({ uuid }: { uuid: string }) {
    const deletedAppointment = await db
      .delete(appointments)
      .where(eq(appointments.uuid, uuid))
      .returning()
      .then(takeUniqueOrThrow);

    if (!deletedAppointment)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error when deleting appointment.",
      });

    return deletedAppointment;
  },

  admin: {
    async getAll(page: number, limit: number) {
      const countResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(appointments);
      const total = Number(countResult[0]?.count);

      const allAppointments = await db.query.appointments.findMany({
        with: {
          user: true,
          schedule: true,
          hour: true,
        },
        offset: page,
        limit,
        orderBy: asc(appointments.createdAt),
      });

      return {
        count: total,
        allAppointments,
      };
    },

    async delete({ uuid }: { uuid: string }) {
      const deletedAppointment = await db
        .delete(appointments)
        .where(eq(appointments.uuid, uuid))
        .returning()
        .then(takeUniqueOrThrow);

      if (!deletedAppointment)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error when deleting appointment.",
        });

      return deletedAppointment;
    },
  },
};
