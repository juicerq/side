import { Plus, Trash2 } from "lucide-react";
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

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { api } from "@/trpc/react";
import dayjs from "dayjs";

dayjs.locale("pt-br");

export default function AppointmentsContent() {
  const { data: appointments } = api.appointment.admin.getAll.useQuery();

  if (!appointments) return null;

  return (
    <>
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
      <Table>
        <TableCaption>A list of your recent schedules</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Name</TableHead>
            <TableHead className="w-1/3">Time</TableHead>
            <TableHead className="w-1/3">Created at</TableHead>
            <TableHead className="flex items-center justify-end pr-2">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger>
                    <Trash2 className="h-5 w-5 justify-end text-red-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Schedule</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments?.map((appointment) => (
            <TableRow key={appointment.uuid}>
              <TableCell>{`${appointment.userUuid?.firstName} ${appointment.userUuid?.lastName}`}</TableCell>
              <TableCell>{dayjs(appointment.date).toString()}</TableCell>
              <TableCell>{dayjs(appointment.createdAt).toString()}</TableCell>
              <TableCell>
                <Trash2 className="size-5 text-red-500 hover:text-red-600" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
