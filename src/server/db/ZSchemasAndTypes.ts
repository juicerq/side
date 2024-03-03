import { createInsertSchema } from "drizzle-zod";
import {
  reservations,
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
  reservation: createInsertSchema(reservations),
  scheduleHour: createInsertSchema(scheduleHours),
  scheduleDay: createInsertSchema(scheduleDays),
};

export const outputSchemas = {
  user: inputSchemas.user.required(),
  schedule: inputSchemas.schedule.required(),
  reservation: inputSchemas.reservation.required(),
  scheduleHour: inputSchemas.scheduleHour.required(),
  scheduleDay: inputSchemas.scheduleDay.required(),
};

// -- TYPES -- \\

export type Reservation = z.infer<typeof inputSchemas.reservation>;

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
