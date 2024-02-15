"use client";

import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: isLogged, isLoading } = api.user.verify.useQuery();
  const router = useRouter();

  if (isLogged === false) router.push("/login");

  if (isLogged === true) router.push("/schedule");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {isLoading && <Loader2 className="h-12 w-12 animate-spin" />}
    </div>
  );
}
