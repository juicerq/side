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
import { inputSchemas } from "@/server/db/ZSchemasAndTypes";
import { api } from "@/trpc/react";
import { RouterOutputs, type RouterInputs } from "@/trpc/shared";
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

type CreateHour = RouterInputs["schedule"]["hour"]["create"];

type HoursOutput = RouterOutputs["schedule"]["hour"]["getAll"];

interface HoursContentProps {
  hours: HoursOutput | undefined;
  fetchingHours: boolean;
}

export default function HoursContent({
  hours,
  fetchingHours,
}: HoursContentProps) {
  const form = useForm<CreateHour>({
    resolver: zodResolver(
      inputSchemas.scheduleHour.pick({
        hour: true,
      })
    ),
  });

  const utils = api.useUtils();

  const { mutate: createHour, isLoading: creatingHour } =
    api.schedule.hour.create.useMutation({
      onSuccess: (response) => {
        toast("Hour created successfully", {
          position: "bottom-right",
          description: `New hour created (${response.hour ?? "BUG!"})`,
        });
      },
      onError: (err) => {
        toast(err.message, {
          position: "bottom-right",
          description: "Please, try again.",
        });
      },
      onSettled: () => {
        utils.schedule.hour.getAll.refetch();
        utils.schedule.getAll.refetch();
      },
    });

  const { mutate: deleteHour } = api.schedule.hour.delete.useMutation({
    onSuccess: () => {
      toast("Hour deleted successfully", {
        position: "bottom-right",
      });
    },
    onError: (err) => {
      toast(err.message, {
        position: "bottom-right",
        description: "Please, try again.",
      });
    },
    onSettled: () => {
      utils.schedule.hour.getAll.refetch();
      utils.schedule.getAll.refetch();
    },
  });
  const handleSubmit = ({ hour }: CreateHour) => {
    createHour({ hour });
  };

  const showHours = !!hours?.length;

  return (
    <Card className="flex p-4 flex-col h-max gap-4">
      {!showHours && !fetchingHours && (
        <div className="my-4 flex w-64 justify-center rounded-lg p-3 text-primary">
          <div className="flex items-center gap-2">
            <Hourglass className="size-5" />
            No hours found
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <h1>Hours</h1>
        {fetchingHours &&
          Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-64 rounded-md" />
          ))}
        <div className="flex gap-2">
          {showHours &&
            !fetchingHours &&
            hours?.map((hour) => (
              <div
                key={hour.uuid}
                className="flex w-max items-center justify-between rounded-md bg-primary-foreground p-2 text-primary"
              >
                <div className="flex items-center gap-2">{hour.hour}</div>
              </div>
            ))}
        </div>
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
                    render={({ field: { onChange, value } }) => (
                      <FormItem>
                        <FormLabel>Hour</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="12:30"
                            inputMode="numeric"
                            value={value}
                            onChange={(e) => {
                              const maxContet = value
                                ? value.length > 4
                                : false;
                              console.log(maxContet);
                              if (maxContet) return;
                              onChange(e.target.value);
                            }}
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

{
  /* <div
                onClick={() => deleteHour({ uuid: hour.uuid ?? "" })}
                className="cursor-pointer"
              >
                <Trash className="size-5 text-red-500 hover:text-red-600" />
              </div> */
}
