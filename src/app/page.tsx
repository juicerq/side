"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
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
                <p className="text-muted-foreground text-xs">Disponível</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-md bg-red-500" />
                <p className="text-muted-foreground text-xs">Preenchido</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex w-[600px] flex-wrap gap-4">
          {Array.from({ length: 31 }).map((_, i) => (
            <div
              key={i}
              className={`hover:bg-secondary ${i % 2 ? "text-emerald-600" : "text-red-600"} flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border text-sm transition-all duration-300 active:scale-110`}
            >
              {i + 1}
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
