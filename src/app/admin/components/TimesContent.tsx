import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { CalendarRange, Clock, Loader2, Plus } from "lucide-react";
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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const NewTimeFormSchema = z.object({
  hour: z
    .number({ required_error: "The hour is required" })
    .min(0, "The hour must be a valid hour")
    .max(23, "The hour must be a valid hour"),
  minute: z.number().min(0).max(59).optional(),
});

type NewTimeFormSchema = z.infer<typeof NewTimeFormSchema>;

export default function TimesContent() {
  const form = useForm<NewTimeFormSchema>({
    resolver: zodResolver(NewTimeFormSchema),
  });

  const { data: times, isLoading: fecthingTimes } =
    api.schedule.times.getAll.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const { mutate: createTime, isLoading: creatingTime } =
    api.schedule.newTime.useMutation({
      onSuccess: () => {
        form.reset();
        toast("Time created successfully", {
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

  const handleSubmit = (data: NewTimeFormSchema) => {
    createTime(data);
  };

  return (
    <>
      <div className="space-y-4">
        {times?.map((time) => (
          <div className="my-4 flex w-64 justify-between rounded-lg bg-primary-foreground p-3 text-primary">
            <div key={time.uuid} className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {time.hourOfDay}
            </div>
            <div className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5" />
              Day
            </div>
          </div>
        ))}
      </div>
      <Drawer>
        <DrawerTrigger>
          <div className="mt-2 flex w-64 justify-center rounded-lg border p-2 text-emerald-600">
            <Plus className="mr-2" />
            Create new time
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="mx-auto">New Time</DrawerTitle>
            <DrawerDescription className="mx-auto">
              Create a new time
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="space-y-8">
            <div className="mx-auto flex flex-col items-center justify-center gap-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4 rounded-md p-6"
                >
                  <FormField
                    control={form.control}
                    name="hour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hour</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minute</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mx-auto flex gap-2">
                    <Button type="submit" className="mx-auto w-fit">
                      {creatingTime ? (
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
