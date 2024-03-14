import { CalendarDays, Settings } from "lucide-react";
import SidebarLink from "./components/Sidebar/SidebarLink";
import { useSearchParams } from "next/navigation";

const SidebarItems = [
  {
    name: "Appointments",
    path: "appointments",
    icon: CalendarDays,
  },
  {
    name: "Customization",
    path: "customization",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100vh] w-screen">
      {/* SideBar */}
      <div className="fixed h-full pt-16 w-60 left-0 bg-background-secondary border-r border-input flex-col">
        <div className="flex flex-col py-10 gap-6">
          {SidebarItems.map((item) => (
            <SidebarLink key={item.name} name={item.name} path={item.path} />
          ))}
        </div>
      </div>
      <div className="pl-60 pt-16 w-full">{children}</div>
    </div>
  );
}
