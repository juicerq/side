import { Button } from "@/app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { Month } from "@/app/utils/generateMonths";
import { AllSchedules } from "@/server/db/ZSchemasAndTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const today = new Date().getDate();

interface DaySquareProps {
  day: Month;
  schedules: AllSchedules[number] | undefined;
}

export function DaySquare({ day, schedules }: DaySquareProps) {
  const validDay = today <= day.day;
  const noSchedules = !schedules;

  console.log(schedules);

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className={`hover:bg-primary-foreground bg-transparent ${validDay && "cursor-pointer text-emerald-600 hover:rounded-lg"} flex h-10 w-10 items-center justify-center rounded-md border text-sm transition-all duration-300 active:scale-110 disabled:pointer-events-none disabled:text-red-600`}
                disabled={!validDay || noSchedules}
              >
                {day.day}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <p>Schedules for {day.weekDay}</p>
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent className="bg-secondary text-secondary-foreground">
          {noSchedules ? <p>No Schedules</p> : <p>{day.weekDay}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
