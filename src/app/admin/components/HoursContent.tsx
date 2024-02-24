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
import { Skeleton } from "@/app/components/ui/skeleton";

type CreateHour = RouterInputs["schedule"]["hour"]["create"];

export default function HoursContent() {
  const form = useForm<CreateHour>({
    resolver: zodResolver(
      inputSchemas.scheduleHour.pick({
        hour: true,
      }),
    ),
  });

  const {
    data: hours,
    refetch: refetchhours,
    isLoading: fetchingHours,
  } = api.schedule.hour.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { mutate: createHour, isLoading: creatingHour } =
    api.schedule.hour.create.useMutation({
      onSuccess: () => {
        refetchhours();
        toast("Hour created successfully", {
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

  const { mutate: deleteHour } = api.schedule.hour.delete.useMutation({
    onSuccess: () => {
      refetchhours();
      toast("Hour deleted successfully", {
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
  const handleSubmit = ({ hour }: CreateHour) => {
    createHour({ hour });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1>Hours</h1>
      <div className="flex flex-col space-y-4">
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
                <Clock className="h-5 w-5" />
                {hour.hour}
              </div>
              <div
                onClick={() => deleteHour({ uuid: hour.uuid })}
                className="cursor-pointer"
              >
                <Trash className="size-5 text-red-500 hover:text-red-600" />
              </div>
            </div>
          ))
        ) : (
          <div className="my-4 flex w-64 justify-center rounded-lg p-3 text-primary">
            <div className="flex items-center gap-2">
              <Hourglass className="h-5 w-5" />
              No hours found
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
            Create new hour
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
                          <Input {...field} placeholder="12:30" />
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
    </div>
  );
}
