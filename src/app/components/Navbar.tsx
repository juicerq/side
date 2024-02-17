"use client";

import Cookies from "js-cookie";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import Link from "next/link";

const links = [
  {
    name: "Schedule",
    href: "/schedule",
  },
  {
    name: "Admin",
    href: "/admin",
  },
];

export default function Navbar() {
  const path = usePathname();
  const shouldRender = path !== "/login" && path !== "/register";
  const router = useRouter();

  const { data } = shouldRender
    ? api.user.info.useQuery(undefined, {
        refetchOnWindowFocus: false,
        cacheTime: 1000,
      })
    : { data: null };

  if (!shouldRender) return null;
  return (
    <div className="fixed left-0 top-0 flex h-16 w-screen items-center justify-center bg-transparent px-12">
      <div className="flex-1">
        <ul className="flex items-center justify-center gap-12">
          {links.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="text-sm hover:opacity-80">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute right-10">
        <div className="flex items-center justify-end gap-2">
          <Avatar>
            <AvatarFallback className="bg-primary-foreground uppercase">
              {data?.firstName[0]}
              {data?.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="items-between flex flex-col">
            <p className="text-sm">{`${data?.firstName} ${data?.lastName}`}</p>
            <p
              onClick={() => {
                Cookies.remove("access_token");
                router.push("/login");
              }}
              className="w-fit cursor-pointer text-xs text-red-700 hover:underline hover:underline-offset-1 "
            >
              Sair
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
