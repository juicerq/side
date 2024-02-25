import { Button } from "@/app/components/ui/button";
import { CalendarRange, Loader2, Plus, Trash } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer";

import { inputSchemas } from "@/server/db/ZSchemasAndTypes";
import { api } from "@/trpc/react";
import { type RouterInputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Skeleton } from "@/app/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@components/ui/toggle-group";

type CreateScheduleInput = RouterInputs["schedule"]["create"];

export default function SchedulesContent() {
  const form = useForm<CreateScheduleInput>({
    resolver: zodResolver(
      inputSchemas.schedule.pick({
        hourUuid: true,
        dayUuid: true,
      }),
    ),
    defaultValues: {
      hourUuids: [],
    },
  });

  const {
    data,
    isLoading: fetchingSchedules,
    refetch: refetchSchedules,
  } = api.schedule.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteSchedule } = api.schedule.delete.useMutation({
    onSuccess: () => {
      refetchSchedules();
      toast("schedule deleted successfully", {
        position: "bottom-center",
      });
    },
    onError: (err) => {
      toast(err.message, {
        description: "Please, try again.",
        position: "bottom-center",
      });
    },
  });

  const { mutate: createSchedule, isLoading: creatingSchedule } =
    api.schedule.create.useMutation({
      onSuccess: () => {
        form.reset();
        refetchSchedules();
        toast("Schedule created successfully", {
          position: "bottom-center",
        });
      },
      onError: (err) => {
        toast(err.message, {
          description: "Please, try again.",
          position: "bottom-center",
        });
      },
    });

  const handleSubmit = ({ hourUuids, dayUuid }: CreateScheduleInput) => {
    console.log(hourUuids);
    createSchedule({ hourUuids: form.getValues("hourUuids"), dayUuid });
  };

  const handleAddHour = (value: string) => {
    if (form.getValues("hourUuids").includes(value)) {
      form.setValue(
        "hourUuids",
        form.getValues("hourUuids").filter((hour) => hour !== value),
      );
      return;
    }
    form.setValue("hourUuids", [...form.getValues("hourUuids"), value]);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1>Your Schedules</h1>
      <div className="space-y-4">
        {fetchingSchedules ? (
          Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-64 rounded-md" />
          ))
        ) : !!data?.allSchedules?.length ? (
          data.allSchedules?.map((schedule, i) => (
            <div
              key={i}
              className="flex w-64 items-center justify-between rounded-md bg-primary-foreground p-2 px-4 text-primary"
            >
              <div className="flex items-center gap-2">
                <CalendarRange className="h-5 w-5" />
                {schedule.day.weekDay} -{" "}
                {schedule.hours.map((hour) => hour.hourUuid.hour).join(", ")}
              </div>
              <div
                onClick={() => deleteSchedule({ uuid: schedule.uuid })}
                className="cursor-pointer"
              >
                <Trash className="size-5 text-red-500 hover:text-red-600" />
              </div>
            </div>
          ))
        ) : (
          <div className="my-4 flex w-64 justify-center rounded-md p-3 text-primary">
            <div className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5" />
              No schedules found
            </div>
          </div>
        )}
      </div>
      <Drawer>
        <DrawerTrigger>
          <Button
            variant="outline"
            className=" mt-2 w-64 justify-center text-emerald-600"
          >
            <Plus className="mr-2" />
            Create new schedule
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col items-center justify-between">
          <DrawerHeader>
            <DrawerTitle className="mx-auto">New schedule</DrawerTitle>
            <DrawerDescription className="mx-auto">
              Create a new schedule
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <div className="items-between mx-auto flex items-center justify-center gap-3">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4 rounded-md p-6"
                >
                  <FormField
                    control={form.control}
                    name="dayUuid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Schedule Day</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Choose Day" />
                            </SelectTrigger>
                            <SelectContent>
                              {data?.daysOptions?.map((day, i) => (
                                <SelectItem key={i} value={day.uuid}>
                                  {day.weekDay}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hourUuids"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Schedule Hour</FormLabel>
                        <FormControl>
                          <ToggleGroup type="multiple">
                            {data?.hoursOptions?.map((hour, i) => (
                              <ToggleGroupItem
                                value={hour.uuid}
                                aria-label="Toggle bold"
                                key={i}
                                onClick={() => handleAddHour(hour.uuid)}
                              >
                                {hour.hour}
                              </ToggleGroupItem>
                            ))}
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mx-auto flex gap-2">
                    <Button type="submit" className="mx-auto w-fit">
                      {creatingSchedule ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Create"
                      )}
                    </Button>
                    <DrawerClose>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </div>
                </form>
              </Form>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
