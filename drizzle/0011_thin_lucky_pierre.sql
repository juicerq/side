DO $$ BEGIN
 ALTER TABLE "juit_schedules" ADD CONSTRAINT "juit_schedules_uuid_juit_scheduleHours_uuid_fk" FOREIGN KEY ("uuid") REFERENCES "juit_scheduleHours"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
