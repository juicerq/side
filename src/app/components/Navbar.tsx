"use client";

import Cookies from "js-cookie";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import Link from "next/link";
import Image from "next/image";

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
  const shouldRender =
    path !== "/login" && path !== "/register" && path !== "/";
  const router = useRouter();

  const { data: user } = shouldRender
    ? api.user.info.useQuery(undefined, {
        refetchOnWindowFocus: false,
        cacheTime: 1000,
      })
    : { data: null };

  if (shouldRender)
    return (
      <div className="fixed left-0 top-0 flex h-16 w-screen items-center justify-between bg-transparent px-12">
        <div className="flex flex-1 items-center gap-8">
          <div>
            <img
              src={"/../../public/logo.webp"}
              alt="logo"
              width={20}
              height={20}
            />
          </div>
          <ul className="flex items-center justify-center gap-6">
            {links.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-sm hover:opacity-80">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {user && (
          <div className="flex items-center justify-end gap-2">
            <Avatar>
              <AvatarFallback className="bg-primary-foreground uppercase">
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
                className="w-fit cursor-pointer text-xs text-red-700 hover:underline hover:underline-offset-1 "
              >
                Sair
              </p>
            </div>
          </div>
        )}
      </div>
    );
}
