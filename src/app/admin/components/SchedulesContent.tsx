import { Button } from "@/app/components/ui/button";
import { CalendarRange, Check, Info, Loader2, Plus, Trash } from "lucide-react";
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
} from "@/components/ui/select";
import { Skeleton } from "@/app/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card } from "@/app/components/ui/card";
import Toast from "@/app/components/Toast";

type CreateScheduleInput = RouterInputs["schedule"]["create"];

export default function SchedulesContent() {
  const form = useForm<CreateScheduleInput>({
    resolver: zodResolver(
      inputSchemas.schedule.pick({
        hourUuid: true,
        dayUuid: true,
      })
    ),
    defaultValues: {
      hourUuids: [],
    },
  });

  const {
    data,
    isLoading: fetchingSchedules,
    refetch: refetchSchedules,
  } = api.schedule.getAllWithOptions.useQuery(undefined, {
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
        <Toast
          message="Schedule created successfully"
          icon={<Check className="h-7 w-7 text-[#FFFF]" />}
          success
        />;
      },
      onError: (err) => {
        <Toast
          message={err.message}
          icon={<Info className="h-7 w-7 text-[#FFFF]" />}
          description="Please, try again."
        />;
      },
    });

  const handleSubmit = ({ dayUuid }: CreateScheduleInput) => {
    createSchedule({ hourUuids: form.getValues("hourUuids"), dayUuid });
  };

  const handleAddHour = (value: string) => {
    // If the hour already exists, throw an error
    if (form.getValues("hourUuids").includes(value)) {
      form.setValue(
        "hourUuids",
        form.getValues("hourUuids").filter((hour) => hour !== value)
      );
      return (
        <Toast
          message="Hour already exists"
          icon={<Info className="h-7 w-7 text-[#FFFF]" />}
        />
      );
    }
    form.setValue("hourUuids", [...form.getValues("hourUuids"), value]);
  };

  console.log(data?.allSchedules);

  return (
    <Card className="flex p-4 flex-col items-center justify-between gap-4">
      <div className="space-y-4">
        <h1 className="text-center">Your Schedules</h1>
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
          <Button variant="secondary" className="mt-2 w-64 justify-center">
            <Plus className="size-5 mr-2" />
            New Schedule
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
                          {data?.daysOptions?.length ? (
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
                          ) : (
                            <div className="my-4 flex w-64 justify-center rounded-md bg-primary-foreground border px-3 py-1 text-primary">
                              <div className="flex items-center gap-2">
                                <CalendarRange className="h-5 w-5" />
                                No hours found
                              </div>
                            </div>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hourUuids"
                    render={() => (
                      <FormItem>
                        <FormLabel>Schedule Hour</FormLabel>
                        <FormControl>
                          <ToggleGroup type="multiple">
                            {data?.hoursOptions?.length ? (
                              data?.hoursOptions?.map((hour, i) => (
                                <ToggleGroupItem
                                  value={hour.uuid}
                                  aria-label="Toggle bold"
                                  key={i}
                                  onClick={() => handleAddHour(hour.uuid)}
                                >
                                  {hour.hour}
                                </ToggleGroupItem>
                              ))
                            ) : (
                              <div className="my-4 flex w-64 justify-center rounded-md bg-primary-foreground border px-3 py-1 text-primary">
                                <div className="flex items-center gap-2">
                                  <CalendarRange className="h-5 w-5" />
                                  No hours found
                                </div>
                              </div>
                            )}
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-center gap-2">
                    <Button type="submit" className="w-fit">
                      {creatingSchedule ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Create Schedule"
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
    </Card>
  );
}
