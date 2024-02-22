"use client";

import { Loader2 } from "lucide-react";

import { api } from "@/trpc/react";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import DaysContent from "./components/DaysContent";
import SchedulesContent from "./components/SchedulesContent";
import TimesContent from "./components/TimesContent";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
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
    router.push("/schedule");
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
