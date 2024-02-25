import { db } from "@/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { scheduleHours, schedules } from "@/server/db/schema";

export const testeRouter = createTRPCRouter({
  teste: publicProcedure.query(async () => {
    const teste = await db.query.schedules.findMany();

    return teste;
  }),
});
