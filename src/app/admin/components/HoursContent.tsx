import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Clock, Hourglass, Loader2, Plus, Trash } from "lucide-react";
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

import { Card } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { ScheduleHour, inputSchemas } from "@/server/db/ZSchemasAndTypes";
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
import { useAdminHours } from "@/app/components/hooks/useAdminHours";
import { revalidatePath } from "next/cache";
import { KeyboardEventHandler } from "react";

type CreateHour = RouterInputs["schedule"]["hour"]["create"];

interface HoursContentProps {
  hours: ScheduleHour[] | undefined;
  refetchHours: () => void;
  fetchingHours: boolean;
  refetchSchedules: () => void;
}

export default function HoursContent({
  hours,
  refetchHours,
  fetchingHours,
  refetchSchedules,
}: HoursContentProps) {
  const form = useForm<CreateHour>({
    resolver: zodResolver(
      inputSchemas.scheduleHour.pick({
        hour: true,
      })
    ),
  });

  const { mutate: createHour, isLoading: creatingHour } =
    api.schedule.hour.create.useMutation({
      onSuccess: (response) => {
        refetchHours();
        refetchSchedules();
        toast("Hour created successfully", {
          position: "bottom-center",
          description: `New hour created (${response.hour ?? "BUG!"})`,
        });
      },
      onError: (err) => {
        toast(err.message, {
          position: "bottom-center",
          description: "Please, try again.",
        });
      },
    });

  const { mutate: deleteHour } = api.schedule.hour.delete.useMutation({
    onSuccess: () => {
      refetchHours();
      toast("Hour deleted successfully", {
        position: "bottom-center",
      });
    },
    onError: (err) => {
      toast(err.message, {
        position: "bottom-center",
        description: "Please, try again.",
      });
    },
  });
  const handleSubmit = ({ hour }: CreateHour) => {
    createHour({ hour });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = /[0-9\n\b:]/;
    const key = event.key;

    console.log(key);

    if (key === "Backspace" || key === "Enter" || key === "Scape") return;

    if (!allowedKeys.test(key)) {
      event.preventDefault();
    }
  };

  return (
    <Card className="flex p-4 flex-col items-center gap-4">
      <div className="flex flex-col space-y-4">
        <h1 className="text-center">Hours</h1>
        {fetchingHours ? (
          Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-64 rounded-md" />
          ))
        ) : !!hours?.length ? (
          hours?.map((hour) => (
            <div
              key={hour.uuid}
              className="flex w-64 items-center justify-between rounded-md bg-primary-foreground p-2 text-primary"
            >
              <div className="flex items-center gap-2">
                <Clock className="size-5" />
                {hour.hour}
              </div>
              <div
                onClick={() => deleteHour({ uuid: hour.uuid ?? "" })}
                className="cursor-pointer"
              >
                <Trash className="size-5 text-red-500 hover:text-red-600" />
              </div>
            </div>
          ))
        ) : (
          <div className="my-4 flex w-64 justify-center rounded-lg p-3 text-primary">
            <div className="flex items-center gap-2">
              <Hourglass className="size-5" />
              No hours found
            </div>
          </div>
        )}
      </div>
      <Drawer>
        <DrawerTrigger>
          <Button variant="secondary" className="mt-2 w-64 justify-center ">
            <Plus className="mr-2 size-5" />
            New Hour
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="mx-auto">New hour</DrawerTitle>
            <DrawerDescription className="mx-auto">
              Create a new hour
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
                          <Input
                            {...field}
                            placeholder="12:30"
                            inputMode="numeric"
                            onKeyDown={handleKeyDown}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mx-auto flex gap-2">
                    <Button type="submit" className="mx-auto w-fit">
                      {creatingHour ? (
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
