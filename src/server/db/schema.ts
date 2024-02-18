import { sql } from "drizzle-orm";
import {
  boolean,
  pgTableCreator,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const monthEnum = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
] as const;

export const dayOfWeekEnum = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const createTable = pgTableCreator((name) => `juit_${name}`);

export const users = createTable(
  "users",
  {
    uuid: uuid("uuid").defaultRandom().primaryKey(),
    firstName: varchar("firstName", { length: 256 }).notNull(),
    lastName: varchar("lastName", { length: 256 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    isAdmin: boolean("isAdmin").default(false).notNull(),
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (users) => ({
    userIndex: uniqueIndex("user_idx").on(users.email),
  }),
);

export const schedules = createTable(
  "schedules",
  {
    uuid: uuid("uuid").defaultRandom().primaryKey(),
    userUuid: uuid("uuid")
      .notNull()
      .references(() => users.uuid, {
        onDelete: "cascade",
      }),
    month: varchar("month", {
      enum: monthEnum,
      length: 2,
    }).notNull(),
    dayOfWeek: varchar("day", {
      enum: dayOfWeekEnum,
      length: 10,
    }).notNull(),
    scheduleTimeUuid: uuid("uuid")
      .notNull()
      .references(() => scheduleHours.uuid, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (schedules) => ({
    scheduleIndex: uniqueIndex("schedule_idx").on(schedules.uuid),
  }),
);

export const scheduleHours = createTable("scheduleHours", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  hourOfDay: varchar("hourOfDay", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});
