import { env } from "@/env";
import jwt from "jsonwebtoken";
import { z } from "zod";

const jwtSchema = z.object({
  uuid: z.string(),
});

export const verifyToken = (token: string | undefined) => {
  if (!token) return null;

  try {
    const rawToken = jwt.verify(token, env.JWT_SECRET);

    const parsed = jwtSchema.parse(rawToken);

    return parsed.uuid;
  } catch {
    return null;
  }
};
