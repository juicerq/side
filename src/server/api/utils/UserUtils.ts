
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { CreateUserInput, LoginUserInput } from "../schemas/input/User";
import { takeUniqueOrThrow } from "./DrizzleUtils";
import { env } from "@/env";

export const UserUtils = {
  async create({ firstName, lastName, email }: CreateUserInput) {
    const alreadyExists = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then(takeUniqueOrThrow);

    if (!!alreadyExists) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User already exists.",
      });
    }

    const newUser = await db
      .insert(users)
      .values({ firstName, lastName, email });

    if (!newUser) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error when creating user.",
      });
    }

    return { success: true };
  },

  async login({ email }: LoginUserInput) {
    const user = await db
      .select({ uuid: users.uuid })
      .from(users)
      .where(eq(users.email, email))
      .then(takeUniqueOrThrow);

    if (!!!user) {
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
};
