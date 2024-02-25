ALTER TABLE "juit_reservations" RENAME COLUMN "userUuid" TO "user_uuid";--> statement-breakpoint
ALTER TABLE "juit_reservations" RENAME COLUMN "scheduleUuid" TO "schedule_uuid";--> statement-breakpoint
ALTER TABLE "juit_scheduleDays" RENAME COLUMN "weekDay" TO "week_day";--> statement-breakpoint
ALTER TABLE "juit_scheduleDays" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "juit_scheduleDays" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "juit_scheduleHours" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "juit_schedules" RENAME COLUMN "scheduleDayUuid" TO "day_uuid";--> statement-breakpoint
ALTER TABLE "juit_schedules" RENAME COLUMN "scheduleHourUuid" TO "hour_uuid";--> statement-breakpoint
ALTER TABLE "juit_schedules" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "juit_schedules" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "juit_users" RENAME COLUMN "firstName" TO "first_name";--> statement-breakpoint
ALTER TABLE "juit_users" RENAME COLUMN "lastName" TO "last_name";--> statement-breakpoint
ALTER TABLE "juit_users" RENAME COLUMN "isAdmin" TO "is_admin";--> statement-breakpoint
ALTER TABLE "juit_users" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "juit_users" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "juit_reservations" DROP CONSTRAINT "juit_reservations_userUuid_juit_users_uuid_fk";
--> statement-breakpoint
ALTER TABLE "juit_reservations" DROP CONSTRAINT "juit_reservations_scheduleUuid_juit_schedules_uuid_fk";
--> statement-breakpoint
ALTER TABLE "juit_schedules" DROP CONSTRAINT "juit_schedules_scheduleDayUuid_juit_scheduleDays_uuid_fk";
--> statement-breakpoint
ALTER TABLE "juit_schedules" DROP CONSTRAINT "juit_schedules_scheduleHourUuid_juit_scheduleHours_uuid_fk";
--> statement-breakpoint
ALTER TABLE "juit_schedules" ALTER COLUMN "hour_uuid" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "juit_scheduleHours" ADD COLUMN "schedule_uuid" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_reservations" ADD CONSTRAINT "juit_reservations_user_uuid_juit_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "juit_users"("uuid") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_reservations" ADD CONSTRAINT "juit_reservations_schedule_uuid_juit_schedules_uuid_fk" FOREIGN KEY ("schedule_uuid") REFERENCES "juit_schedules"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_scheduleHours" ADD CONSTRAINT "juit_scheduleHours_schedule_uuid_juit_schedules_uuid_fk" FOREIGN KEY ("schedule_uuid") REFERENCES "juit_schedules"("uuid") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_schedules" ADD CONSTRAINT "juit_schedules_day_uuid_juit_scheduleDays_uuid_fk" FOREIGN KEY ("day_uuid") REFERENCES "juit_scheduleDays"("uuid") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_schedules" ADD CONSTRAINT "juit_schedules_hour_uuid_juit_scheduleHours_uuid_fk" FOREIGN KEY ("hour_uuid") REFERENCES "juit_scheduleHours"("uuid") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
