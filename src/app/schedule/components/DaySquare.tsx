import { Button } from "@/app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { Month } from "@/app/utils/generateMonths";

const today = new Date().getDate();

interface DaySquareProps {
  day: Month;
}

export function DaySquare({ day }: DaySquareProps) {
  const validDay = today <= day.day;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>
          <Button
            className={`hover:bg-primary-foreground bg-transparent ${validDay ? "cursor-pointer text-emerald-500 hover:rounded-lg" : "pointer-events-none text-red-500"} flex h-10 w-10 items-center justify-center rounded-md border text-sm transition-all duration-300 active:scale-110`}
            disabled={!validDay}
          >
            {day.day}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-secondary text-secondary-foreground">
          <p>{day.weekDay}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
