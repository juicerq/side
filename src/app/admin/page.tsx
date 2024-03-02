"use client";

import { unstable_noStore } from "next/cache";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import useCheckPermission from "../utils/hooks/useCheckPermission";
import DaysContent from "./components/DaysContent";
import HoursContent from "./components/HoursContent";
import ReservationsContent from "./components/ReservationsContent";
import SchedulesContent from "./components/SchedulesContent";

export default function AdminPage() {
  unstable_noStore()
   useCheckPermission("admin")

    return (
      <div className="flex min-h-screen w-screen items-center justify-center">
        <Tabs
          defaultValue="reservations"
          className="flex w-full flex-col items-center justify-center"
        >
          <TabsList className="w-fit">
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
          </TabsList>
          <div className="h-96">
            <TabsContent
              value="reservations"
              className="mx-auto flex w-[700px] flex-col items-center justify-center gap-6"
            >
              <ReservationsContent />
            </TabsContent>

            <TabsContent
              value="customization"
              className=" flex w-full justify-between gap-12"
            >
              <HoursContent />
              <DaysContent />
              <SchedulesContent />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
}