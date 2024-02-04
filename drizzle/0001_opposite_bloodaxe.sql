ALTER TABLE "juit_post" RENAME TO "juit_user";--> statement-breakpoint
ALTER TABLE "juit_user" ADD COLUMN "email" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "juit_user" ADD CONSTRAINT "juit_user_email_unique" UNIQUE("email");