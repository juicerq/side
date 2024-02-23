import { createInsertSchema } from "drizzle-zod";
import {
  reservations,
  scheduleDays,
  scheduleHours,
  schedules,
  users,
} from "./schema";
import { z } from "zod";

// -- SCHEMAS -- \\

export const dbSchemas = {
  CreateUserSchema: createInsertSchema(users),
  CreateScheduleSchema: createInsertSchema(schedules),
  CreateReservationSchema: createInsertSchema(reservations),
  CreateScheduleHourSchema: createInsertSchema(scheduleHours),
  CreateScheduleDaysSchema: createInsertSchema(scheduleDays),
};

// -- TYPES -- \\

export type Reservation = z.infer<typeof dbSchemas.CreateReservationSchema>;

export type User = z.infer<typeof dbSchemas.CreateUserSchema>;

export type Schedule = z.infer<typeof dbSchemas.CreateScheduleSchema>;

export type ScheduleHour = z.infer<typeof dbSchemas.CreateScheduleHourSchema>;

export type ScheduleDay = z.infer<typeof dbSchemas.CreateScheduleDaysSchema>;

export type SendConfirmationCode = {
  email: string;
  code: string;
  type: string;
};
