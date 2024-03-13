import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group";
import { Month } from "@/app/utils/generateMonths";
import { getTimestamp } from "@/app/utils/getTimestamp";
import { AllSchedules, inputSchemas } from "@/server/db/ZSchemasAndTypes";
import { api } from "@/trpc/react";
import { RouterInputs, RouterOutputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type AllHours = RouterOutputs["schedule"]["hour"]["getAll"];

interface AppointmentFormProps {
  allHours: AllHours | undefined;
  schedule: AllSchedules[number] | undefined;
  appointments: RouterOutputs["appointment"]["getAll"] | undefined;
  day: Month;
  refetchAppointments: () => void;
}

type CreateAppointment = RouterInputs["appointment"]["create"];

export default function AppointmentForm({
  allHours,
  schedule,
  appointments,
  day,
  refetchAppointments,
}: AppointmentFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { mutate: createAppointment, isLoading: creatingAppointment } =
    api.appointment.create.useMutation({
      onSuccess: () => {
        refetchAppointments();
        toast("Appointment created successfully", {
          position: "bottom-center",
        });
      },
      onError: (err) => {
        toast(err.message, {
          position: "bottom-center",
        });
      },
    });

  const form = useForm<CreateAppointment>({
    resolver: zodResolver(
      inputSchemas.appointment.pick({
        scheduleUuid: true,
        date: true,
        hourUuid: true,
        observations: true,
        status: true,
      })
    ),
    defaultValues: {
      scheduleUuid: schedule?.uuid,
    },
  });

  const handleSubmit = (data: CreateAppointment) => {
    createAppointment({ ...data });
  };

  const handleClickHour = (data: { thisDay: Date; hourUuid: string }) => {
    const { thisDay, hourUuid } = data;
    if (selectedDate === null) {
      form.setValue("date", thisDay);
      setSelectedDate(thisDay);
      return form.setValue("hourUuid", hourUuid);
    }
    if (thisDay.getTime() === selectedDate?.getTime())
      return setSelectedDate(null);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-[400px] space-y-4 rounded-md"
      >
        <FormField
          control={form.control}
          name="hourUuid"
          render={() => (
            <FormItem className="flex justify-start pt-4 flex-col">
              <FormLabel>
                All hour available for {schedule?.day.weekDay}
              </FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  className="w-fit rounded-md grid grid-cols-5"
                >
                  {allHours &&
                    allHours.map((hour) => {
                      const thisDay = getTimestamp(
                        day.month ?? "",
                        day.day,
                        hour.hour
                      );

                      if (!thisDay) return null;

                      const hourUsed = appointments?.some((appointment) => {
                        return appointment.date.getTime() === thisDay.getTime();
                      });

                      return (
                        <ToggleGroupItem
                          value={hour.uuid ?? ""}
                          aria-label="Toggle bold"
                          disabled={!!hourUsed}
                          key={hour.uuid}
                          onClick={() =>
                            handleClickHour({
                              thisDay,
                              hourUuid: hour.uuid ?? "",
                            })
                          }
                          className="bg-primary-foreground transition-all active:scale-105"
                        >
                          <div
                            className="size-2 data-[notused=true]:bg-emerald-500 data-[notused=false]:bg-red-500 mr-2 rounded-full"
                            data-notused={!!!hourUsed}
                          />
                          {hour.hour}
                        </ToggleGroupItem>
                      );
                    })}
                </ToggleGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={creatingAppointment || !!!selectedDate}
          className="w-fit"
        >
          {creatingAppointment ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            "Schedule"
          )}
        </Button>
      </form>
    </Form>
  );
}
