"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";
import Cookies from "js-cookie";
import Link from "next/link";

const FormSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
});

type FormType = z.infer<typeof FormSchema>;

export default function LoginUser() {
  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate } = api.user.login.useMutation({
    onSuccess: (response) => {
      Cookies.set("access_token", response.token);
      form.reset();
    },
    onError: (error) => {
      console.log(error);
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
          <Button type="submit">Entrar</Button>
          <Link
            href={"/register"}
            className="cursor-pointer text-xs text-primary hover:underline hover:underline-offset-1"
          >
            Criar Conta
          </Link>
        </div>
      </form>
    </Form>
  );
}
