// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgTableCreator,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `juit_${name}`);

export const users = createTable(
  "users",
  {
    uuid: uuid("uuid").defaultRandom().primaryKey(),
    first_name: varchar("first_name", { length: 256 }).notNull(),
    last_name: varchar("last_name", { length: 256 }).notNull(),
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
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (schedules) => ({
    scheduleIndex: uniqueIndex("schedule_idx").on(schedules.uuid),
  }),
);

export const scheduleTimes = createTable("scheduleTimes", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  day: varchar("day", { length: 100 }).notNull(),
  hour: varchar("hour", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});
