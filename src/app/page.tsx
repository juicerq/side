"use client";

import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: isLogged } = api.user.verify.useQuery();
  const router = useRouter();

  if (!isLogged) router.push("/login");

  if (isLogged) router.push("/schedule");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin" />
    </div>
  );
}
