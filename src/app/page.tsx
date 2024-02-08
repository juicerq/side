"use client";

import { api } from "@/trpc/react";
import { Schedule } from "./components/Schedule";
import CreateAccountForm from "./components/CreateAccountForm";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data } = api.user.verify.useQuery();
  const router = useRouter();

  if (data === false) router.push("/login");

  if (data)
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Schedule />
      </main>
    );
}
