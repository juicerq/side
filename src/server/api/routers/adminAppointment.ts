import { db } from "@/server/db";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { AppointmentUtils } from "../utils/AppointmentUtils";
import { inputSchemas } from "@/server/db/ZSchemasAndTypes";

export const adminAppointmentRoute = createTRPCRouter({
  getAll: adminProcedure.query(async () => {
    const allAppointments = AppointmentUtils.admin.getAll();

    return allAppointments;
  }),

  delete: adminProcedure
    .input(inputSchemas.appointment.pick({ uuid: true }).required())
    .output(inputSchemas.appointment.required())
    .mutation(async ({ input }) => {
      return await AppointmentUtils.admin.delete({ uuid: input.uuid });
    }),
});
