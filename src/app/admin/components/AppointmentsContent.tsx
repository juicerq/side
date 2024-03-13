import { Frown, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

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

import { Skeleton } from "@/app/components/ui/skeleton";
import { api } from "@/trpc/react";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

dayjs.locale("pt-br");

export default function AppointmentsContent() {
  const {
    data: appointments,
    refetch: refetchAppointments,
    isLoading: fetchingAppointments,
  } = api.appointment.admin.getAll.useQuery();

  const { mutate: deleteAppointment, isLoading: deletingAppointment } =
    api.appointment.admin.delete.useMutation({
      onSuccess: () => {
        refetchAppointments();
        toast("Schedule deleted successfully", {
          position: "bottom-center",
        });
      },
      onError: (err) => {
        toast(err.message, {
          position: "bottom-center",
        });
      },
    });

  return (
    <div className="w-full h-max border p-6 rounded-md space-y-3 flex flex-col">
      <div className="ml-auto">
        <Drawer>
          <DrawerTrigger>
            <Button className="justify-end">
              <Plus className="mr-2 h-4 w-4" />
              Create Schedule
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="mx-auto">New Schedule</DrawerTitle>
              <DrawerDescription className="mx-auto">
                Create a new schedule manually
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="space-y-8">
              <div className="mx-auto flex flex-col items-center justify-center gap-6">
                <Input placeholder="Day of Week" />
                <Input placeholder="Hour" />
              </div>
              <div className="mx-auto flex gap-2">
                <Button className="mx-auto w-fit">Create Schedule</Button>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      {appointments?.length ? (
        fetchingAppointments ? (
          Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-64 rounded-md" />
          ))
        ) : (
          <Table>
            <TableCaption>A list of your recent schedules</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="flex-1">Created by</TableHead>
                <TableHead className="flex-1">Scheduled to</TableHead>
                <TableHead className="flex-1">Created at</TableHead>
                <TableHead className="flex items-center justify-end pr-2"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments?.map((appointment) => (
                <TableRow key={appointment.uuid}>
                  <TableCell>{`${appointment.user?.firstName} ${appointment.user?.lastName}`}</TableCell>
                  <TableCell>
                    {dayjs(appointment.date).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell>
                    {dayjs(appointment.createdAt)
                      .add(3, "hour")
                      .format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider delayDuration={50}>
                      <Tooltip>
                        <TooltipTrigger
                          onClick={() =>
                            deleteAppointment({ uuid: appointment.uuid })
                          }
                          disabled={deletingAppointment}
                        >
                          <Trash2 className="h-5 w-5 justify-end text-red-500" />
                        </TooltipTrigger>
                        <TooltipContent>Delete Schedule</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      ) : (
        <div className="my-4 flex w-64 justify-center rounded-md p-3 text-primary">
          <div className="flex items-center gap-2">
            No appointments found
            <Frown className="size-5" />
          </div>
        </div>
      )}
    </div>
  );
}
