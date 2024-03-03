import { api } from "@/trpc/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useIsLogged() {
  const { data: isLogged, isLoading } = api.user.verify.useQuery();
  const router = useRouter();
  const pathname = usePathname();
  const safePathname = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!isLogged && !isLoading && !safePathname) router.push("/login");
  }, [isLogged, isLoading]);
}
