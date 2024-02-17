"use client";

import { CalendarRange, Clock, Loader2, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

export default function AdminPage() {
  const { data: user, isLoading } = api.user.info.useQuery(undefined, {
    cacheTime: 500,
  });
  const router = useRouter();

  // TODO: Remover double rendering of toast

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (user?.isAdmin === false) {
    toast("You are not authorized to view this page", {
      position: "bottom-center",
    });
    window.history.back();
  }

  if (user?.isAdmin)
    return (
      <div className="flex min-h-screen w-screen items-center justify-center">
        <Tabs
          defaultValue="schedules"
          className="flex w-full flex-col items-center justify-center"
        >
          <TabsList className="w-fit">
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="times">Times</TabsTrigger>
          </TabsList>
          <div className="h-96">
            <TabsContent
              value="schedules"
              className="mx-auto mt-4 flex w-[700px] flex-col items-center justify-center gap-6"
            >
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
                      <DrawerTitle className="mx-auto">
                        New Schedule
                      </DrawerTitle>
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
                        <Button className="mx-auto w-fit">
                          Create Schedule
                        </Button>
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
                  <TableRow>
                    <TableCell>Júlio Cerqueira</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent
              value="times"
              className="mx-auto mt-4 flex h-32 w-[700px] flex-col items-center justify-center gap-6"
            >
              <div className="flex w-64 justify-between rounded-lg bg-primary-foreground p-4 text-primary">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  08:00
                </div>
                <div className="flex items-center gap-2">
                  <CalendarRange className="h-5 w-5" />
                  Thursday
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
}
