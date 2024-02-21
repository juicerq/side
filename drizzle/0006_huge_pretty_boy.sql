ALTER TABLE "juit_schedules" DROP CONSTRAINT "juit_schedules_uuid_juit_scheduleHours_uuid_fk";
--> statement-breakpoint
ALTER TABLE "juit_scheduleHours" ALTER COLUMN "hourOfDay" SET DATA TYPE time(2) USING "hourOfDay"::time(2) with time zone;--> statement-breakpoint
ALTER TABLE "juit_reservations" ADD COLUMN "observations" varchar(256);--> statement-breakpoint
ALTER TABLE "juit_reservations" ADD COLUMN "status" varchar(10);--> statement-breakpoint
ALTER TABLE "juit_schedules" DROP COLUMN IF EXISTS "month";