"use client";

import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useStore } from "./useStore";

export default function useCheckPermission(permission: string) {
  const router = useRouter();

  const { user } = useStore()

  if (user?.role !== permission) {
    toast("You are not authorized to view this page", {
      position: "bottom-center",
    });
    router.push("/schedule");
  }

  return isLoading;
}