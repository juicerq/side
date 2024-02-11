"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: isLogged } = api.user.verify.useQuery();
  const router = useRouter();

  if (isLogged === false) router.push("/login");

  if (isLogged === true) router.push("/schedule");
}
