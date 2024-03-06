CREATE TABLE IF NOT EXISTS "juit_hoursOnSchedules" (
	"schedule_uuid" uuid NOT NULL,
	"hour_uuid" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "juit_hoursOnSchedules_schedule_uuid_hour_uuid_pk" PRIMARY KEY("schedule_uuid","hour_uuid")
);
--> statement-breakpoint
ALTER TABLE "juit_reservations" RENAME TO "juit_appointments";--> statement-breakpoint
ALTER TABLE "juit_users" RENAME COLUMN "is_admin" TO "role";--> statement-breakpoint
ALTER TABLE "juit_scheduleHours" DROP CONSTRAINT "juit_scheduleHours_schedule_uuid_juit_schedules_uuid_fk";
--> statement-breakpoint
ALTER TABLE "juit_schedules" DROP CONSTRAINT "juit_schedules_hour_uuid_juit_scheduleHours_uuid_fk";
--> statement-breakpoint
ALTER TABLE "juit_schedules" DROP CONSTRAINT "juit_schedules_day_uuid_juit_scheduleDays_uuid_fk";
--> statement-breakpoint
ALTER TABLE "juit_appointments" DROP CONSTRAINT "juit_reservations_user_uuid_juit_users_uuid_fk";
--> statement-breakpoint
ALTER TABLE "juit_appointments" DROP CONSTRAINT "juit_reservations_schedule_uuid_juit_schedules_uuid_fk";
--> statement-breakpoint
ALTER TABLE "juit_users" ALTER COLUMN "role" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "juit_users" ALTER COLUMN "role" SET DEFAULT 'basic';--> statement-breakpoint
ALTER TABLE "juit_appointments" ALTER COLUMN "user_uuid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "juit_appointments" ALTER COLUMN "schedule_uuid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "juit_appointments" ALTER COLUMN "observations" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "juit_scheduleHours" ADD COLUMN "available" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "juit_users" ADD COLUMN "theme" varchar(256) DEFAULT 'dark' NOT NULL;--> statement-breakpoint
ALTER TABLE "juit_appointments" ADD COLUMN "hour_uuid" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_schedules" ADD CONSTRAINT "juit_schedules_day_uuid_juit_scheduleDays_uuid_fk" FOREIGN KEY ("day_uuid") REFERENCES "juit_scheduleDays"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_appointments" ADD CONSTRAINT "juit_appointments_user_uuid_juit_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "juit_users"("uuid") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_appointments" ADD CONSTRAINT "juit_appointments_schedule_uuid_juit_schedules_uuid_fk" FOREIGN KEY ("schedule_uuid") REFERENCES "juit_schedules"("uuid") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_appointments" ADD CONSTRAINT "juit_appointments_hour_uuid_juit_scheduleHours_uuid_fk" FOREIGN KEY ("hour_uuid") REFERENCES "juit_scheduleHours"("uuid") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "juit_scheduleHours" DROP COLUMN IF EXISTS "schedule_uuid";--> statement-breakpoint
ALTER TABLE "juit_schedules" DROP COLUMN IF EXISTS "hour_uuid";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_hoursOnSchedules" ADD CONSTRAINT "juit_hoursOnSchedules_schedule_uuid_juit_schedules_uuid_fk" FOREIGN KEY ("schedule_uuid") REFERENCES "juit_schedules"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_hoursOnSchedules" ADD CONSTRAINT "juit_hoursOnSchedules_hour_uuid_juit_scheduleHours_uuid_fk" FOREIGN KEY ("hour_uuid") REFERENCES "juit_scheduleHours"("uuid") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
