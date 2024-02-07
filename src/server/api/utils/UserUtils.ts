import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const CreateUserInputSchema = z.object({
  first_name: z
    .string()
    .min(
      2,
      "O limite mínimo de caractéres é 2! Por favor, diminuia e tente novamente.",
    )
    .max(
      50,
      "O limite máximo de caractéres é 50! Por favor, diminuia e tente novamente.",
    ),
  last_name: z
    .string()
    .min(
      2,
      "O limite mínimo de caractéres é 2! Por favor, diminuia e tente novamente.",
    )
    .max(
      50,
      "O limite máximo de caractéres é 50! Por favor, diminuia e tente novamente.",
    ),
  email: z.string().email(),
  // login_code: z.string(),
});

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

export const UserUtils = {
  create: async ({ first_name, last_name, email }: CreateUserInput) => {
    const alreadyExists = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (alreadyExists) {
      return {
        success: false,
        error: "Usuário com esse email já existe.",
      };
    }

    const newUser = await db
      .insert(users)
      .values({ first_name, last_name, email });

    if (!newUser) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao criar o usuário",
      });
    }

    return { success: true };
  },
};
