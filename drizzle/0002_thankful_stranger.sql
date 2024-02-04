ALTER TABLE "juit_user" RENAME TO "juit_users";--> statement-breakpoint
ALTER TABLE "juit_users" DROP CONSTRAINT "juit_user_email_unique";--> statement-breakpoint
ALTER TABLE "juit_users" ADD CONSTRAINT "juit_users_email_unique" UNIQUE("email");