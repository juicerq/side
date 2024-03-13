"use client";

import { Button } from "@/app/components/ui/button";
import { Month } from "@/app/utils/generateMonths";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AllSchedules } from "@/server/db/ZSchemasAndTypes";
import { RouterOutputs } from "@/trpc/shared";
import AppointmentForm from "./AppointmentForm";

const today = new Date().getDate();

interface DaySquareProps {
  day: Month;
  schedule: AllSchedules[number] | undefined;
  appointments: RouterOutputs["appointment"]["getAll"] | undefined;
  refetchAppointments: () => void;
}

export function DaySquare({
  day,
  schedule,
  appointments,
  refetchAppointments,
}: DaySquareProps) {
  const validDay = today <= day.day;
  const noSchedule = !schedule;

  const allHours = schedule?.hours.map((hour) => hour.hour);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`hover:bg-primary-foreground bg-transparent ${validDay && "cursor-pointer text-emerald-600 hover:rounded-lg"} flex h-10 w-10 items-center justify-center rounded-md border text-sm transition-all duration-300 active:scale-110 disabled:pointer-events-none disabled:text-red-600`}
          disabled={!validDay || noSchedule}
        >
          {day.day}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedules for {day.weekDay}</DialogTitle>
          <DialogDescription>
            Choose a available hour to schedule an appointment
          </DialogDescription>
        </DialogHeader>
        <div>
          <AppointmentForm
            allHours={allHours}
            schedule={schedule}
            appointments={appointments}
            day={day}
            refetchAppointments={refetchAppointments}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
