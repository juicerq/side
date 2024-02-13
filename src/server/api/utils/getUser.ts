import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { takeUniqueOrThrow } from "./DrizzleUtils";
import { TRPCError } from "@trpc/server";

export async function getUser(userIdentifier: {
  userUuid?: string | null;
  userEmail?: string | null;
}) {
  const { userUuid, userEmail } = userIdentifier;

  if (!userUuid && !userEmail) {
    return null;
  }

  if (userUuid && userEmail) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cannot provide both userUuid and userEmail",
    });
  }

  let user;

  if (userUuid) {
    user = await db
      .select()
      .from(users)
      .where(eq(users.uuid, userUuid))
      .then(takeUniqueOrThrow);
  } else if (userEmail) {
    user = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .then(takeUniqueOrThrow);
  }

  return { user };
}
