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
import { useEffect, useState } from "react";
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
import NewTime from "./components/TimesContent";
import SchedulesContent from "./components/SchedulesContent";
import TimesContent from "./components/TimesContent";
import DaysContent from "./components/DaysContent";

export default function AdminPage() {
  const { data: user, isLoading } = api.user.info.useQuery(undefined, {
    cacheTime: 500,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!user?.isAdmin) {
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
            <TabsTrigger value="days">Days</TabsTrigger>
          </TabsList>
          <div className="h-96">
            <TabsContent
              value="schedules"
              className="mx-auto flex w-[700px] flex-col items-center justify-center gap-6"
            >
              <SchedulesContent />
            </TabsContent>

            <TabsContent
              value="times"
              className="mx-auto flex w-[700px] flex-col items-center justify-center gap-2"
            >
              <TimesContent />
            </TabsContent>
            <TabsContent
              value="days"
              className="mx-auto flex w-[700px] flex-col items-center justify-center gap-2"
            >
              <DaysContent />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
}
