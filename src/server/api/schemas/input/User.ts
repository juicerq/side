import { z } from "zod";

export const CreateUserInputSchema = z.object({
  firstName: z
    .string()
    .min(
      2,
      "O limite mínimo de caractéres é 2! Por favor, diminuia e tente novamente.",
    )
    .max(
      50,
      "O limite máximo de caractéres é 50! Por favor, diminuia e tente novamente.",
    ),
  lastName: z
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

export const LoginUserInputSchema = z.object({
  email: z.string().email(),
});

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;
export type LoginUserInput = z.infer<typeof LoginUserInputSchema>;
