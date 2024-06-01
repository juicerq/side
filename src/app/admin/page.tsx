"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAdminDays } from "../components/hooks/useAdminDays";
import { useAdminHours } from "../components/hooks/useAdminHours";
import { useAdminSchedules } from "../components/hooks/useAdminSchedules";
import useCheckPermission from "../components/hooks/useCheckPermission";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import AppointmentsContent from "./components/AppointmentsContent";
import DaysContent from "./components/DaysContent";
import HoursContent from "./components/HoursContent";
import SchedulesContent from "./components/SchedulesContent";
import { useEffect } from "react";

export default function AdminPage() {
  const checked = useCheckPermission("admin");
  const searchParams = useSearchParams();
  const path = searchParams.get("path");
  const router = useRouter();

  const { hours, fetchingHours } = useAdminHours();

  const { data, fetchingSchedules, refetchSchedules } = useAdminSchedules();

  const { days, fetchingDays } = useAdminDays();

  useEffect(() => {
    if (!path) return router.push("/admin?path=appointments");
  }, [path]);

  if (checked)
    return (
      <div className="flex h-full w-[1440px] mx-32 px-4 pt-10">
        {path === "appointments" && (
          <div className="h-full space-y-6 w-full flex flex-col">
            <div>
              <h1 className="text-3xl">All Appointments</h1>
              <p className="text-sm text-muted-foreground">
                Here you can see all appointments
              </p>
            </div>
            <AppointmentsContent />
          </div>
        )}
        {path === "customization" && (
          <>
            <HoursContent hours={hours} fetchingHours={fetchingHours} />
            {/* <DaysContent days={days} fetchingDays={fetchingDays} />
            <SchedulesContent
              data={data}
              refetchSchedules={refetchSchedules}
              fetchingSchedules={fetchingSchedules}
            /> */}
          </>
        )}
      </div>
    );
}
