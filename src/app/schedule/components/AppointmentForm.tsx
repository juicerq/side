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
import {
  AllSchedules,
  ScheduleHour,
  inputSchemas,
} from "@/server/db/ZSchemasAndTypes";
import { api } from "@/trpc/react";
import { RouterInputs, RouterOutputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AppointmentFormProps {
  allHours: ScheduleHour[] | undefined;
  schedule: AllSchedules[number] | undefined;
  appointments: RouterOutputs["appointment"]["getAll"] | undefined;
  day: Month;
}

type CreateAppointment = RouterInputs["appointment"]["create"];

export default function AppointmentForm({
  allHours,
  schedule,
  appointments,
  day,
}: AppointmentFormProps) {
  const [selectedHour, setSelectedHour] = useState<string>("");

  const { mutate: createAppointment, isLoading: creatingAppointment } =
    api.appointment.create.useMutation({
      onSuccess: () => {
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

  const handleAddSingleHour = (value: string) => {
    form.setValue("hourUuid", value);
  };

  const handleSubmit = (data: CreateAppointment) => {
    if (!day.month) return console.log("No month selected");
    const date = getTimestamp(day.month, day.weekDay, selectedHour);

    if (!date) return console.log("No date selected");

    createAppointment({ ...data, date: date });
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
                      const hourUsed = appointments?.find(
                        (appointment) =>
                          appointment.hourUuid?.uuid === hour.uuid &&
                          appointment.scheduleUuid?.dayUuid ===
                            schedule?.dayUuid
                      );

                      return (
                        <ToggleGroupItem
                          value={hour.uuid ?? ""}
                          aria-label="Toggle bold"
                          disabled={!!hourUsed}
                          key={hour.uuid}
                          onClick={() => {
                            handleAddSingleHour(hour.uuid ?? "");
                            if (!!!selectedHour)
                              return setSelectedHour(hour.hour);
                            setSelectedHour("");
                          }}
                          className="bg-primary-foreground transition-all active:scale-105"
                        >
                          <div
                            className="size-2 data-[notused=false]:bg-emerald-500 mr-2 bg-red-500 rounded-full"
                            data-notused={!!hourUsed}
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
          disabled={creatingAppointment || !selectedHour}
          onClick={() =>
            handleSubmit({
              userUuid: form.getValues("userUuid"),
              scheduleUuid: form.getValues("scheduleUuid"),
              hourUuid: form.getValues("hourUuid"),
              observations: form.getValues("observations"),
              status: form.getValues("status"),
              date: form.getValues("date"),
            })
          }
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
