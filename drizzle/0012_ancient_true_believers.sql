ALTER TABLE "juit_reservations" RENAME TO "side_reservations";--> statement-breakpoint
ALTER TABLE "juit_scheduleDays" RENAME TO "side_scheduleDays";--> statement-breakpoint
ALTER TABLE "juit_scheduleHours" RENAME TO "side_scheduleHours";--> statement-breakpoint
ALTER TABLE "juit_schedules" RENAME TO "side_schedules";--> statement-breakpoint
ALTER TABLE "juit_users" RENAME TO "side_users";--> statement-breakpoint
ALTER TABLE "side_users" DROP CONSTRAINT "juit_users_email_unique";--> statement-breakpoint
ALTER TABLE "side_reservations" DROP CONSTRAINT "juit_reservations_uuid_juit_users_uuid_fk";
--> statement-breakpoint
ALTER TABLE "side_reservations" DROP CONSTRAINT "juit_reservations_uuid_juit_schedules_uuid_fk";
--> statement-breakpoint
ALTER TABLE "side_schedules" DROP CONSTRAINT "juit_schedules_uuid_juit_scheduleDays_uuid_fk";
--> statement-breakpoint
ALTER TABLE "side_schedules" DROP CONSTRAINT "juit_schedules_uuid_juit_scheduleHours_uuid_fk";
--> statement-breakpoint
ALTER TABLE "side_reservations" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "side_reservations" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "side_schedules" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "side_schedules" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "side_reservations" ADD COLUMN "userUuid" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "side_reservations" ADD COLUMN "scheduleUuid" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "side_schedules" ADD COLUMN "scheduleDayUuid" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "side_schedules" ADD COLUMN "scheduleHourUuid" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "side_reservations" ADD CONSTRAINT "side_reservations_userUuid_side_users_uuid_fk" FOREIGN KEY ("userUuid") REFERENCES "side_users"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "side_reservations" ADD CONSTRAINT "side_reservations_scheduleUuid_side_schedules_uuid_fk" FOREIGN KEY ("scheduleUuid") REFERENCES "side_schedules"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "side_schedules" ADD CONSTRAINT "side_schedules_scheduleDayUuid_side_scheduleDays_uuid_fk" FOREIGN KEY ("scheduleDayUuid") REFERENCES "side_scheduleDays"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "side_schedules" ADD CONSTRAINT "side_schedules_scheduleHourUuid_side_scheduleHours_uuid_fk" FOREIGN KEY ("scheduleHourUuid") REFERENCES "side_scheduleHours"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "side_users" ADD CONSTRAINT "side_users_email_unique" UNIQUE("email");