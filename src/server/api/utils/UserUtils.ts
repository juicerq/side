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
      .where(eq(users.email, email));

    if (!!!alreadyExists) {
      return {
        success: false,
        error: "Usuário com esse email já existe.",
      };
    }

    const newUser = await db
      .insert(users)
      .values({ firstName, lastName, email });

    if (!newUser) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao criar o usuário",
      });
    }

    return { success: true };
  },

  async login({ email }: LoginUserInput) {
    const { uuid } = await db
      .select({ uuid: users.uuid })
      .from(users)
      .where(eq(users.email, email))
      .then(takeUniqueOrThrow);

    const token = jwt.sign({ uuid }, env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24 * 365,
    });

    return token;
  },
};
