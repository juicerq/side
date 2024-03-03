import { Button } from "@/app/components/ui/button";
import { ScheduleHour } from "@/server/db/ZSchemasAndTypes";

interface HourInfoProps {
  hour: ScheduleHour[];
}

export default function HourInfo({ hour }: HourInfoProps) {
  return (
    <div className="flex flex-wrap bg-primary-foreground p-4 rounded-lg mt-4 gap-6">
      {hour.map((hour) => (
        <Button
          variant="secondary"
          key={hour.uuid}
          className="flex bg-background items-center gap-2"
        >
          <div
            className={`h-2 w-2 rounded-md ${hour.available ? "bg-emerald-500" : "bg-red-500"} `}
          />
          <p className="text-xs">{hour.hour}</p>
        </Button>
      ))}
    </div>
  );
}
