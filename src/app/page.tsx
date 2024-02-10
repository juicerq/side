"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data } = api.user.verify.useQuery();
  const router = useRouter();

  if (data === false) router.push("/login");

  if (data) router.push("/schedule");
}
