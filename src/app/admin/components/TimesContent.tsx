import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Clock, Loader2, Plus } from "lucide-react";
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
import { RouterInputs } from "@/trpc/shared";
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

type CreateHour = RouterInputs["schedule"]["time"]["create"];

export default function TimesContent() {
  const form = useForm<CreateHour>({
    resolver: zodResolver(
      dbSchemas.CreateScheduleHourSchema.pick({
        hourOfDay: true,
      }),
    ),
  });

  const { data: times, refetch: refetchTimes } =
    api.schedule.time.getAll.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const { mutate: createTime, isLoading: creatingTime } =
    api.schedule.time.create.useMutation({
      onSuccess: () => {
        refetchTimes();
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

  const handleSubmit = ({ hourOfDay }: CreateHour) => {
    createTime({ hourOfDay });
  };

  return (
    <>
      <div className="space-y-4">
        {times?.map((time) => (
          <div
            key={time.uuid}
            className="my-4 flex w-64 justify-center rounded-lg bg-primary-foreground p-3 text-primary"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {time.hourOfDay}
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
                    name="hourOfDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hour</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="12:30" />
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
