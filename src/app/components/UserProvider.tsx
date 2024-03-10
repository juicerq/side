"use client";

import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useStore } from "./hooks/useStore";
import useIsLogged from "./useIsLogged";

interface UserProviderProps {
  children: ReactNode;
}

export default function UserProvider({ children }: UserProviderProps) {
  useIsLogged();
  const pathname = usePathname();
  const safePathname = pathname === "/login" || pathname === "/register";

  const { data: userData } = api.user.info.useQuery();
  const { setUser } = useStore();

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  return (
    <>
      {!!userData || safePathname ? (
        children
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      )}
    </>
  );
}
