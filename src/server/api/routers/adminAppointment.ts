import { inputSchemas } from "@/server/db/ZSchemasAndTypes";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { AppointmentUtils } from "../utils/AppointmentUtils";

export const adminAppointmentRoute = createTRPCRouter({
  getAll: adminProcedure.query(async () => {
    const allAppointments = AppointmentUtils.admin.getAll();

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
