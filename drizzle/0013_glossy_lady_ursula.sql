ALTER TABLE "side_reservations" RENAME TO "juit_reservations";--> statement-breakpoint
ALTER TABLE "side_scheduleDays" RENAME TO "juit_scheduleDays";--> statement-breakpoint
ALTER TABLE "side_scheduleHours" RENAME TO "juit_scheduleHours";--> statement-breakpoint
ALTER TABLE "side_schedules" RENAME TO "juit_schedules";--> statement-breakpoint
ALTER TABLE "side_users" RENAME TO "juit_users";--> statement-breakpoint
ALTER TABLE "juit_users" DROP CONSTRAINT "side_users_email_unique";--> statement-breakpoint
ALTER TABLE "juit_reservations" DROP CONSTRAINT "side_reservations_userUuid_side_users_uuid_fk";
--> statement-breakpoint
ALTER TABLE "juit_reservations" DROP CONSTRAINT "side_reservations_scheduleUuid_side_schedules_uuid_fk";
--> statement-breakpoint
ALTER TABLE "juit_schedules" DROP CONSTRAINT "side_schedules_scheduleDayUuid_side_scheduleDays_uuid_fk";
--> statement-breakpoint
ALTER TABLE "juit_schedules" DROP CONSTRAINT "side_schedules_scheduleHourUuid_side_scheduleHours_uuid_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_reservations" ADD CONSTRAINT "juit_reservations_userUuid_juit_users_uuid_fk" FOREIGN KEY ("userUuid") REFERENCES "juit_users"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_reservations" ADD CONSTRAINT "juit_reservations_scheduleUuid_juit_schedules_uuid_fk" FOREIGN KEY ("scheduleUuid") REFERENCES "juit_schedules"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_schedules" ADD CONSTRAINT "juit_schedules_scheduleDayUuid_juit_scheduleDays_uuid_fk" FOREIGN KEY ("scheduleDayUuid") REFERENCES "juit_scheduleDays"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_schedules" ADD CONSTRAINT "juit_schedules_scheduleHourUuid_juit_scheduleHours_uuid_fk" FOREIGN KEY ("scheduleHourUuid") REFERENCES "juit_scheduleHours"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "juit_users" ADD CONSTRAINT "juit_users_email_unique" UNIQUE("email");