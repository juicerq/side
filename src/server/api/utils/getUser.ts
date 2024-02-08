import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { takeUniqueOrThrow } from "./DrizzleUtils";

export async function getUser(userUuid: string | null) {
  if (!userUuid) return null;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.uuid, userUuid))
    .then(takeUniqueOrThrow);

  return { user };
}
