"use client";

import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { generateMonths } from "../utils/generateMonths";
import { DaySquare } from "./components/DaySquare";

export default function Schedule() {
  const { firstMonth, secondMonth, thirdMonth } = generateMonths();

  const { data: schedules } = api.schedule.getAll.useQuery();

  if (!schedules) return;
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Schedule your appointment</CardTitle>
            <CardDescription>
              Choose a day and hour to make an appointment
            </CardDescription>
          </div>

          <div className="flex flex-col justify-between">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-md bg-emerald-500" />
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-md bg-red-500" />
              <p className="text-xs text-muted-foreground">Unavailable</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex w-[650px] flex-wrap gap-4">
        <Tabs defaultValue="firstMonth" className="flex w-full flex-col gap-8">
          <TabsList className="w-fit">
            <TabsTrigger value="firstMonth">{firstMonth[0]?.month}</TabsTrigger>
            <TabsTrigger value="secondMonth">
              {secondMonth[0]?.month}
            </TabsTrigger>
            <TabsTrigger value="thirdMonth">{thirdMonth[0]?.month}</TabsTrigger>
          </TabsList>
          <div className="h-36">
            <TabsContent
              value="firstMonth"
              className="flex flex-wrap mt-0 items-center gap-2"
            >
              {firstMonth.map((day, i) => {
                const schedule = schedules.find(
                  (s) => s.day.weekDay === day.weekDay.toLowerCase()
                );

                console.log(schedule);

                return <DaySquare key={i} day={day} schedules={schedule} />;
              })}
            </TabsContent>

            <TabsContent
              value="secondMonth"
              className="flex flex-wrap mt-0 items-center gap-2"
            >
              {secondMonth.map((day, i) => {
                const schedule = schedules?.find(
                  (s) => s.day.weekDay === day.weekDay.toLowerCase()
                );
                return <DaySquare key={i} day={day} schedules={schedule} />;
              })}
            </TabsContent>
            <TabsContent
              value="thirdMonth"
              className="flex flex-wrap mt-0 items-center gap-2"
            >
              {thirdMonth.map((day, i) => {
                const schedule = schedules?.find(
                  (s) => s.day.weekDay === day.weekDay.toLowerCase()
                );
                return <DaySquare key={i} day={day} schedules={schedule} />;
              })}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
