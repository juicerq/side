import { relations, sql } from "drizzle-orm";
import {
  boolean,
  pgTableCreator,
  time,
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

export const reservations = createTable("reservations", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  userUuid: uuid("uuid")
    .notNull()
    .references(() => users.uuid, { onDelete: "cascade", onUpdate: "cascade" }),
  scheduleUuid: uuid("uuid")
    .notNull()
    .references(() => schedules.uuid, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  observations: varchar("observations", { length: 256 }),
  status: varchar("status", {
    enum: ["scheduled", "concluded", "canceled"],
    length: 10,
  }),
});
export const reservartionsRelations = relations(reservations, ({ one }) => ({
  userUuid: one(users, {
    fields: [reservations.userUuid],
    references: [users.uuid],
  }),
  scheduleUuid: one(schedules, {
    fields: [reservations.scheduleUuid],
    references: [schedules.uuid],
  }),
}));

export const schedules = createTable(
  "schedules",
  {
    uuid: uuid("uuid").defaultRandom().primaryKey(),
    scheduleDayUuid: uuid("uuid")
      .notNull()
      .references(() => scheduleDays.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    scheduleHourUuid: uuid("uuid")
      .notNull()
      .references(() => scheduleHours.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
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
export const schedulesRelations = relations(schedules, ({ one }) => ({
  scheduleDayUuid: one(scheduleDays, {
    fields: [schedules.uuid],
    references: [scheduleDays.uuid],
  }),
  scheduleHourUuid: one(scheduleHours, {
    fields: [schedules.uuid],
    references: [scheduleHours.uuid],
  }),
}));

export const scheduleHours = createTable("scheduleHours", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  hourOfDay: varchar("hourOfDay", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});
export const scheduleHoursRelations = relations(scheduleHours, ({ many }) => ({
  schedules: many(schedules),
}));

export const scheduleDays = createTable("scheduleDays", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  dayOfWeek: varchar("dayOfWeek", {
    enum: dayOfWeekEnum,
    length: 10,
  }).notNull(),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});
export const scheduleDaysRelations = relations(scheduleHours, ({ many }) => ({
  schedules: many(schedules),
}));
