import { Button } from "@/app/components/ui/button";
import { CalendarRange, Loader2, Plus } from "lucide-react";
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

import { dbSchemas } from "@/server/db/SchemasAndTypes";
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

type CreateDayInput = RouterInputs["schedule"]["day"]["create"];

export default function DaysContent() {
  const form = useForm<CreateDayInput>({
    resolver: zodResolver(
      dbSchemas.CreateScheduleDaysSchema.pick({ dayOfWeek: true }),
    ),
  });

  const { data: days, refetch: refetchDays } = api.schedule.day.getAll.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  const { mutate: createDay, isLoading: creatingDay } =
    api.schedule.day.create.useMutation({
      onSuccess: () => {
        form.reset();
        refetchDays();
        toast("Day created successfully", {
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

  const handleSubmit = ({ dayOfWeek }: CreateDayInput) => {
    createDay({ dayOfWeek });
  };

  return (
    <>
      <div className="space-y-4">
        {days?.map((day) => (
          <div
            key={day.uuid}
            className="my-4 flex w-64 justify-center rounded-lg bg-primary-foreground p-3 text-primary"
          >
            <div className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5" />
              {day.dayOfWeek.charAt(0).toUpperCase() + day.dayOfWeek.slice(1)}
            </div>
          </div>
        ))}
      </div>
      <Drawer>
        <DrawerTrigger>
          <div className="mt-2 flex w-64 justify-center rounded-lg border p-2 text-emerald-600">
            <Plus className="mr-2" />
            Create new day
          </div>
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
                    name="dayOfWeek"
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
    </>
  );
}