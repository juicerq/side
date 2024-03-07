import { inputSchemas } from "@/server/db/ZSchemasAndTypes";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { AppointmentUtils } from "../utils/AppointmentUtils";
import { z } from "zod";
import dayjs from "dayjs";
import { adminAppointmentRoute } from "./adminAppointment";

export const appointmentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return await AppointmentUtils.getAll();
  }),

  create: publicProcedure
    .input(
      inputSchemas.appointment.pick({
        userUuid: true,
        scheduleUuid: true,
        hourUuid: true,
        observations: true,
        status: true,
        date: true,
      })
    )
    .output(inputSchemas.appointment.required())
    .mutation(async ({ input, ctx }) => {
      const newAppointment = await AppointmentUtils.create({
        userUuid: ctx.user?.uuid,
        scheduleUuid: input.scheduleUuid,
        hourUuid: input.hourUuid,
        observations: input.observations,
        status: input.status,
        date: input.date,
      });

      return newAppointment;
    }),

  admin: adminAppointmentRoute,
});
