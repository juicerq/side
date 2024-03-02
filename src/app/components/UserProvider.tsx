"use client"

import { api } from "@/trpc/react";
import { ReactNode, useEffect } from "react";
import { useStore } from "../utils/hooks/useStore";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
      {!!userData || safePathname ? children : <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>}
    </>
  )
} 