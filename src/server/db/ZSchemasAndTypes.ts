import { createInsertSchema } from "drizzle-zod";
import {
  appointments,
  scheduleDays,
  scheduleHours,
  schedules,
  users,
} from "./schema";
import { z } from "zod";
import { RouterOutputs } from "@/trpc/shared";

// -- SCHEMAS -- \\

export const inputSchemas = {
  user: createInsertSchema(users),
  schedule: createInsertSchema(schedules),
  appointment: createInsertSchema(appointments),
  scheduleHour: createInsertSchema(scheduleHours),
  scheduleDay: createInsertSchema(scheduleDays),
};

export const outputSchemas = {
  user: inputSchemas.user.required(),
  schedule: inputSchemas.schedule.required(),
  appointment: inputSchemas.appointment.required(),
  scheduleHour: inputSchemas.scheduleHour.required(),
  scheduleDay: inputSchemas.scheduleDay.required(),
};

// -- TYPES -- \\

export type Appointment = z.infer<typeof inputSchemas.appointment>;

export type User = z.infer<typeof inputSchemas.user>;

export type Schedule = z.infer<typeof inputSchemas.schedule>;

export type ScheduleHour = z.infer<typeof inputSchemas.scheduleHour>;

export type ScheduleDay = z.infer<typeof inputSchemas.scheduleDay>;

export type SendConfirmationCode = {
  email: string;
  code: string;
  type: string;
};

export type AllSchedules = RouterOutputs["schedule"]["getAll"];
