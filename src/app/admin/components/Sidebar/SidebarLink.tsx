"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface Props {
  path: string;
  name: string;
}

export default function SidebarLink({ path, name }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isActive = searchParams.get("path") === path;

  const setPath = (path: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("path", path);
    router.push("admin" + "?" + params.toString());
  };

  return (
    <button
      type="button"
      className="flex rounded-md mx-2 pl-14 transition-all duration-200 gap-2"
      onClick={() => setPath(path)}
    >
      <p
        data-active={isActive}
        className="text-sm data-[active=false]:text-muted-foreground data-[active=true]:text-primary"
      >
        {name}
      </p>
    </button>
  );
}
