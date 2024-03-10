import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { takeUniqueOrThrow } from "./DrizzleUtils";

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

  if (userUuid) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.uuid, userUuid))
      .then(takeUniqueOrThrow);
    return user;
  } else if (userEmail) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .then(takeUniqueOrThrow);
    return user;
  }
}
