"use client";

import { Account } from "./components/Account";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { api } from "@/trpc/react";

export default async function Home() {
  const { data } = api.user.verify.useQuery();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {data ? (
        <>
          <Account />
          <Card className="">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Agende seu horário</CardTitle>
                  <CardDescription>
                    Clique em um dia para agendar seu horário
                  </CardDescription>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-md bg-emerald-500" />
                    <p className="text-xs text-muted-foreground">Disponível</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-md bg-red-500" />
                    <p className="text-xs text-muted-foreground">Preenchido</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex w-[600px] flex-wrap gap-4">
              {Array.from({ length: 31 }).map((_, i) => (
                <div
                  key={i}
                  className={`hover:bg-secondary ${i % 2 ? "cursor-pointer text-emerald-500 hover:rounded-lg" : "pointer-events-none text-red-500"} flex h-10 w-10 items-center justify-center rounded-md border text-sm transition-all duration-300 active:scale-110`}
                >
                  {i + 1}
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      ) : (
        <div>Não autenticado.</div>
      )}
    </main>
  );
}
