"use client"

import { api } from "@/trpc/react";
import { ReactNode, useEffect } from "react";
import { useStore } from "../lib/utils/useStore";
import { usePathname, useRouter } from "next/navigation";

interface UserProviderProps {
  children: ReactNode;
}

export default function UserProvider({children}: UserProviderProps) {
  const { data: isLogged, isLoading } = api.user.verify.useQuery();
  const pathname = usePathname();
  const router = useRouter();
  const safePathname = pathname === "/login" || pathname === "/register"

  if (!isLogged && !isLoading && !safePathname) router.push("/login");

  const { data: userData } = api.user.info.useQuery();
  const { setUser } = useStore()

  useEffect(() => {
    if (userData) setUser(userData)
  }, [userData])

  return (
    <>
      {children}
    </>
  )
} 