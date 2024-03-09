"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import useCheckPermission from "../components/hooks/useCheckPermission";
import DaysContent from "./components/DaysContent";
import HoursContent from "./components/HoursContent";
import AppointmentsContent from "./components/AppointmentsContent";
import SchedulesContent from "./components/SchedulesContent";
import { useAdminHours } from "../components/hooks/useAdminHours";
import { useAdminSchedules } from "../components/hooks/useAdminSchedules";
import { useAdminDays } from "../components/hooks/useAdminDays";

export default function AdminPage() {
  const checked = useCheckPermission("admin");

  const { hours, refetchHours, fetchingHours } = useAdminHours();

  const { data, fetchingSchedules, refetchSchedules } = useAdminSchedules();

  const { days, refetchDays, fetchingDays } = useAdminDays();

  if (checked)
    return (
      <div className="flex min-h-screen w-screen items-center justify-center">
        <Tabs
          defaultValue="appointment"
          className="flex w-full flex-col items-center justify-center"
        >
          <TabsList className="w-fit">
            <TabsTrigger value="appointment">Appointment</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
          </TabsList>
          <div className="h-96">
            <TabsContent
              value="appointment"
              className="mx-auto flex w-[700px] flex-col items-center justify-center gap-6"
            >
              <AppointmentsContent />
            </TabsContent>

            <TabsContent
              value="customization"
              className=" flex w-full justify-between gap-12"
            >
              <HoursContent
                hours={hours}
                refetchHours={refetchHours}
                fetchingHours={fetchingHours}
                refetchSchedules={refetchSchedules}
              />
              <DaysContent
                days={days}
                refetchDays={refetchDays}
                fetchingDays={fetchingDays}
                refetchSchedules={refetchSchedules}
              />
              <SchedulesContent
                data={data}
                refetchSchedules={refetchSchedules}
                fetchingSchedules={fetchingSchedules}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
}
