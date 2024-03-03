import { relations, sql } from "drizzle-orm";
import {
  boolean,
  pgTableCreator,
  primaryKey,
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

export const daysOfWeekEnum = [
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
    firstName: varchar("first_name", { length: 256 }).notNull(),
    lastName: varchar("last_name", { length: 256 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    role: varchar("role", { enum: ["basic", "admin"], length: 256 })
      .notNull()
      .default("basic"),
    theme: varchar("theme", { enum: ["dark", "light"], length: 256 })
      .notNull()
      .default("dark"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (users) => ({
    userIndex: uniqueIndex("user_idx").on(users.email),
  })
);

export const reservations = createTable("reservations", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  userUuid: uuid("user_uuid")
    .notNull()
    .references(() => users.uuid, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  scheduleUuid: uuid("schedule_uuid")
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

export const schedules = createTable(
  "schedules",
  {
    uuid: uuid("uuid").defaultRandom().primaryKey(),
    dayUuid: uuid("day_uuid")
      .notNull()
      .references(() => scheduleDays.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (schedules) => ({
    scheduleIndex: uniqueIndex("schedule_idx").on(schedules.uuid),
  })
);

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
  day: one(scheduleDays, {
    fields: [schedules.dayUuid],
    references: [scheduleDays.uuid],
  }),
  hours: many(hoursOnSchedules),
}));

export const hoursOnSchedules = createTable(
  "hoursOnSchedules",
  {
    scheduleUuid: uuid("schedule_uuid")
      .notNull()
      .references(() => schedules.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    hourUuid: uuid("hour_uuid")
      .notNull()
      .references(() => scheduleHours.uuid, {
        onUpdate: "cascade",
      }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.scheduleUuid, t.hourUuid] }),
  })
);

export const hoursOnSchedulesRelations = relations(
  hoursOnSchedules,
  ({ one }) => ({
    scheduleUuid: one(schedules, {
      fields: [hoursOnSchedules.scheduleUuid],
      references: [schedules.uuid],
    }),
    hourUuid: one(scheduleHours, {
      fields: [hoursOnSchedules.hourUuid],
      references: [scheduleHours.uuid],
    }),
  })
);

export const scheduleHours = createTable("scheduleHours", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  hour: varchar("hour", { length: 50 }).notNull(),
  available: boolean("available").notNull().default(true),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const scheduleHoursRelations = relations(scheduleHours, ({ many }) => ({
  schedules: many(hoursOnSchedules),
}));

export const scheduleDays = createTable("scheduleDays", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  weekDay: varchar("week_day", {
    enum: daysOfWeekEnum,
    length: 10,
  }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

export const scheduleDaysRelations = relations(scheduleDays, ({ many }) => ({
  schedules: many(schedules),
}));

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
