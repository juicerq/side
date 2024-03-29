"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NavbarConfig } from "./NavbarConfig";
import { useStore } from "./hooks/useStore";
import { Avatar, AvatarFallback } from "./ui/avatar";

const links = [
  {
    name: "Schedule",
    href: "/schedule",
  },
  {
    name: "Admin",
    href: "/admin",
    defaultPath: "path=appointments",
  },
];

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();
  const { user, setUser } = useStore();
  const shouldRender =
    path !== "/login" && path !== "/register" && path !== "/";

  if (shouldRender && user)
    return (
      <div className="fixed z-10 left-0 top-0 flex h-16 border-b w-screen items-center justify-between bg-background-secondary pl-36 pr-12">
        <div className="flex flex-1 items-center gap-8">
          <ul className="flex items-center justify-center gap-6 pl-36">
            {links.map((link) => {
              if (user.role !== "admin" && link.href === "/admin") return null;
              return (
                <li key={link.name}>
                  <Link
                    href={
                      link.defaultPath
                        ? link.href + "?" + link.defaultPath
                        : link.href
                    }
                    className="text-sm hover:opacity-80"
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Avatar>
            <AvatarFallback className="bg-secondary text-primary uppercase">
              {user?.firstName[0]}
              {user?.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="items-between flex flex-col">
            <p className="text-sm">{`${user?.firstName} ${user?.lastName}`}</p>
            <p
              onClick={() => {
                Cookies.remove("access_token");
                router.push("/login");
              }}
              className="w-fit cursor-pointer text-xs text-red-500 hover:underline hover:underline-offset-1"
            >
              Logout
            </p>
          </div>
          <NavbarConfig user={user} setUser={setUser} />
        </div>
      </div>
    );
}
