import { db } from "@/server/db";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const adminAppointmentRoute = createTRPCRouter({
  getAll: adminProcedure.query(async () => {
    const allAppointments = await db.query.appointments.findMany({
      with: {
        userUuid: true,
        scheduleUuid: true,
        hourUuid: true,
      },
    });

    return allAppointments;
  }),
});
