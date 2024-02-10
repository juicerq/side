import Cookies from "js-cookie";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useRouter } from "next/navigation";

export default function Account() {
  const router = useRouter();

  return (
    <div className="fixed left-0 top-0 flex h-12 w-screen items-center justify-end">
      <div className="flex items-center gap-2 px-12 pt-6">
        <Avatar>
          <AvatarFallback>JC</AvatarFallback>
        </Avatar>
        <div className="items-between flex flex-col">
          <p className="text-sm">Júlio Cerqueira</p>
          <p
            onClick={() => {
              console.log(Cookies.get("access_token"));
              // router.push("/login");
            }}
            className="w-fit cursor-pointer text-xs text-red-700 hover:underline hover:underline-offset-1 "
          >
            Sair
          </p>
        </div>
      </div>
    </div>
  );
}
