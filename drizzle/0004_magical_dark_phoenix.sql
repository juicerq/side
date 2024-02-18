ALTER TABLE "juit_scheduleTimes" RENAME TO "juit_scheduleHours";--> statement-breakpoint
ALTER TABLE "juit_schedules" ADD COLUMN "month" varchar(2) NOT NULL;--> statement-breakpoint
ALTER TABLE "juit_schedules" ADD COLUMN "day" varchar(10) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_schedules" ADD CONSTRAINT "juit_schedules_uuid_juit_scheduleHours_uuid_fk" FOREIGN KEY ("uuid") REFERENCES "juit_scheduleHours"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "juit_scheduleHours" DROP COLUMN IF EXISTS "day";