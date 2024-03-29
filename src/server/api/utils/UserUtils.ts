import { env } from "@/env";
import { db } from "@/server/db";
import { SendConfirmationCode, User } from "@/server/db/ZSchemasAndTypes";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { takeUniqueOrThrow } from "./DrizzleUtils";
import { Email } from "./Email";
import { getUser } from "./getUser";

export const UserUtils = {
  async create({ firstName, lastName, email }: User) {
    const newUser = await db
      .insert(users)
      .values({ firstName, lastName, email })
      .returning()
      .onConflictDoNothing()
      .then(takeUniqueOrThrow);

    if (!newUser) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User already exists or something went wrong.",
      });
    }

    return newUser;
  },

  async login({ email }: { email: User["email"] }) {
    const user = await db
      .select({ uuid: users.uuid })
      .from(users)
      .where(eq(users.email, email))
      .then(takeUniqueOrThrow);

    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User with the email provived does not exist.",
      });
    }

    const token = jwt.sign({ uuid: user.uuid }, env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24 * 365,
    });

    return token;
  },

  async sendConfirmationCode({ email, code, type }: SendConfirmationCode) {
    const userExist = await getUser({ userEmail: email });

    // If login and user does not exist, throw error
    if (type === "login") {
      if (!userExist) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No user found for this email.",
        });
      }
    }

    // If register and user already exist, throw error
    if (type === "register") {
      if (userExist) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with this email already exist.",
        });
      }
    }

    const res = await Email.send({
      code: code,
      userEmail: email,
    });

    return res;
  },
};
