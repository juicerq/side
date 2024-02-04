import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const CreateUserInputSchema = z.object({
  name: z.string(),
  email: z.string().email("Email inválido"),
});

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

export const UserUtils = {
  create: async ({ name, email }: CreateUserInput) => {
    const alreadyExists = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.email, email));

    if (alreadyExists) {
      return {
        success: false,
        error: "Usário com esse email ja existe",
      };
    }

    const newUser = await db.insert(users).values({ name, email });

    if (!newUser) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao criar o usuário",
      });
    }

    return { success: true };
  },
};
