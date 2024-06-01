import { Frown, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
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
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import Pagination from "./Pagination";
import Status from "./Status";

dayjs.locale("pt-br");

export default function AppointmentsContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : 10;

  const {
    data: response,
    refetch: refetchAppointments,
    isLoading: fetchingAppointments,
  } = api.appointment.admin.getAll.useQuery({
    page: (page - 1) * limit,
    limit,
  });

  const totalPage = Math.ceil((response?.count ?? 0) / limit);

  const { mutate: deleteAppointment, isLoading: deletingAppointment } =
    api.appointment.admin.delete.useMutation({
      onSuccess: () => {
        refetchAppointments();
        toast("Schedule deleted successfully", {
          position: "bottom-right",
        });
      },
      onError: (err) => {
        toast(err.message, {
          position: "bottom-right",
        });
      },
    });

  return (
    <>
      <div className="w-full max-h-[68dvh] border p-6 rounded-md space-y-3 flex flex-col">
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
        {fetchingAppointments ? (
          <div className="min-h-[60dvh] pt-10 space-y-6">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-none" />
            ))}
          </div>
        ) : response?.allAppointments?.length ? (
          <>
            <div className="min-h-[60dvh] max-h-[60dvh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="flex-1">Created by</TableHead>
                    <TableHead className="flex-1">Scheduled to</TableHead>
                    <TableHead className="flex-1">Created at</TableHead>
                    <TableHead className="flex-1">Status</TableHead>
                    <TableHead className="flex-1">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {response?.allAppointments?.map((appointment) => (
                    <TableRow key={appointment.uuid} className="h-16">
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
                        <Status appointmentStatus={appointment.status} />
                      </TableCell>
                      {/* Cell height so it stay in middle */}
                      <TableCell className="flex h-16 items-center">
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
            </div>
          </>
        ) : (
          <div className="my-4 flex w-64 justify-center min-h-[60dvh] rounded-md mx-auto p-3 text-primary">
            <div className="flex items-center gap-2">
              No appointments found
              <Frown className="size-5" />
            </div>
          </div>
        )}
      </div>
      <Pagination page={page} totalPage={totalPage} />
    </>
  );
}
