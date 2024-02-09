import { api } from "@/trpc/react";
import { LoginUser } from "../components/LoginUser";

export default function LoginPage() {
  const { data } = api.user.hello.useQuery({ text: "funciona" });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p>{data?.greeting}</p>
      <LoginUser />
    </div>
  );
}
