CREATE TABLE IF NOT EXISTS "juit_scheduleTimes" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day" varchar(100) NOT NULL,
	"hour" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "juit_schedules" (
	"uuid" uuid NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "juit_users" RENAME COLUMN "name" TO "firstName";--> statement-breakpoint
ALTER TABLE "juit_users" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
ALTER TABLE "juit_users" ADD COLUMN "lastName" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "juit_users" ADD COLUMN "isAdmin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "schedule_idx" ON "juit_schedules" ("uuid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_idx" ON "juit_users" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "juit_schedules" ADD CONSTRAINT "juit_schedules_uuid_juit_users_uuid_fk" FOREIGN KEY ("uuid") REFERENCES "juit_users"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
