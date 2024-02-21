CREATE TABLE IF NOT EXISTS "juit_reservations" (
	"uuid" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "juit_scheduleDays" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dayOfWeek" varchar(10) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "juit_scheduleHours" RENAME COLUMN "hour" TO "hourOfDay";--> statement-breakpoint
ALTER TABLE "juit_schedules" DROP CONSTRAINT "juit_schedules_uuid_juit_users_uuid_fk";
--> statement-breakpoint
ALTER TABLE "juit_schedules" DROP CONSTRAINT "juit_schedules_uuid_juit_scheduleHours_uuid_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_schedules" ADD CONSTRAINT "juit_schedules_uuid_juit_scheduleDays_uuid_fk" FOREIGN KEY ("uuid") REFERENCES "juit_scheduleDays"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_schedules" ADD CONSTRAINT "juit_schedules_uuid_juit_scheduleHours_uuid_fk" FOREIGN KEY ("uuid") REFERENCES "juit_scheduleHours"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "juit_schedules" DROP COLUMN IF EXISTS "day";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_reservations" ADD CONSTRAINT "juit_reservations_uuid_juit_users_uuid_fk" FOREIGN KEY ("uuid") REFERENCES "juit_users"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_reservations" ADD CONSTRAINT "juit_reservations_uuid_juit_schedules_uuid_fk" FOREIGN KEY ("uuid") REFERENCES "juit_schedules"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
