import { inputSchemas } from "@/server/db/ZSchemasAndTypes";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { AppointmentUtils } from "../utils/AppointmentUtils";
import { z } from "zod";

export const adminAppointmentRoute = createTRPCRouter({
  getAll: adminProcedure
    .input(z.object({ page: z.number(), limit: z.number() }))
    .query(async ({ input }) => {
      const allAppointments = AppointmentUtils.admin.getAll(
        input.page,
        input.limit
      );

      return allAppointments;
    }),

  delete: adminProcedure
    .input(inputSchemas.appointment.pick({ uuid: true }).required())
    .output(inputSchemas.appointment.required())
    .mutation(async ({ input }) => {
      const deletedAppointment = await AppointmentUtils.admin.delete({
        uuid: input.uuid,
      });

      return deletedAppointment;
    }),
});
