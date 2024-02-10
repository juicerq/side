"use client";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const FormSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
});

type FormType = z.infer<typeof FormSchema>;

export function LoginUser() {
  const router = useRouter();

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isLoading } = api.user.login.useMutation({
    onSuccess: (response) => {
      Cookies.set("access_token", response.token);
      form.reset();
      router.push("/");
    },
    onError: (error) => {
      toast(error.message, {
        description: "Please, try again.",
        position: "bottom-center",
      });
    },
  });

  const handleSubmit = (data: FormType) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-[400px] space-y-4 rounded-md border p-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end justify-between">
          <Button type="submit" className={`${isLoading && "w-[67px]"}`}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
          <Link
            href={"/register"}
            className="cursor-pointer text-xs text-primary hover:underline hover:underline-offset-1"
          >
            Register a new account
          </Link>
        </div>
      </form>
    </Form>
  );
}
