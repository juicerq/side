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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";

import Toast from "@/app/components/Toast";
import { Card } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type CreateDayInput = RouterInputs["schedule"]["day"]["create"];

export default function DaysContent() {
  const router = useRouter();

  const form = useForm<CreateDayInput>({
    resolver: zodResolver(inputSchemas.scheduleDay.pick({ weekDay: true })),
  });

  const {
    data: days,
    isLoading: fetchingDays,
    refetch: refetchDays,
  } = api.schedule.day.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { mutate: createDay, isLoading: creatingDay } =
    api.schedule.day.create.useMutation({
      onSuccess: () => {
        form.reset();
        refetchDays();
        <Toast
          message="Day created successfully"
          icon={<Check className="h-7 w-7 text-[#FFFF]" />}
          description="You will be redirected to the schedule page in a few seconds."
          success
          position="bottom-center"
        />;
      },
      onError: (err) => {
        <Toast
          message={err.message}
          icon={<Info className="h-7 w-7 text-[#FFFF]" />}
          description="Please, try again."
          position="bottom-center"
        />;
      },
    });

  const { mutate: deleteWeekDay } = api.schedule.day.delete.useMutation({
    onSuccess: () => {
      refetchDays();
      router.refresh();
      <Toast
        message="Day deleted successfully"
        icon={<Trash className="h-7 w-7 text-[#FFFF]" />}
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

  const handleSubmit = ({ weekDay }: CreateDayInput) => {
    createDay({ weekDay });
  };
  return (
    <Card className="flex p-4 flex-col justify-between items-center gap-4">
      <div className="space-y-4">
        <h1 className="text-center">Days</h1>
        {fetchingDays ? (
          Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-64 rounded-md" />
          ))
        ) : !!days?.length ? (
          days?.map((day) => (
            <div
              key={day.uuid}
              className="flex w-64 items-center justify-between rounded-md bg-primary-foreground p-2 px-4 text-primary"
            >
              <div className="flex gap-2">
                <CalendarRange className="size-5" />
                {day.weekDay.charAt(0).toUpperCase() + day.weekDay.slice(1)}
              </div>

              <div
                onClick={() => deleteWeekDay({ uuid: day.uuid })}
                className="cursor-pointer"
              >
                <Trash className="size-5 text-red-500 hover:text-red-600" />
              </div>
            </div>
          ))
        ) : (
          <div className="my-4 flex w-64 justify-center rounded-md bg-primary-foreground border px-3 py-1 text-primary">
            <div className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5" />
              No days found
            </div>
          </div>
        )}
      </div>
      <Drawer>
        <DrawerTrigger>
          <Button variant="secondary" className="w-64 justify-center">
            <Plus className="mr-2 size-5" />
            New Day
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="mx-auto">New Day</DrawerTitle>
            <DrawerDescription className="mx-auto">
              Create a new day
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="space-y-8">
            <div className="items-between mx-auto flex items-center justify-center gap-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4 rounded-md p-6"
                >
                  <FormField
                    control={form.control}
                    name="weekDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Day</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Week Day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monday">Monday</SelectItem>
                              <SelectItem value="tuesday">Tuesday</SelectItem>
                              <SelectItem value="wednesday">
                                Wednesday
                              </SelectItem>
                              <SelectItem value="thursday">Thursday</SelectItem>
                              <SelectItem value="friday">Friday</SelectItem>
                              <SelectItem value="saturday">Saturday</SelectItem>
                              <SelectItem value="sunday">Sunday</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mx-auto flex gap-2">
                    <Button type="submit" className="mx-auto w-fit">
                      {creatingDay ? (
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
    </Card>
  );
}
