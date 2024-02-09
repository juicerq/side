"use client";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
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

const FormSchema = z.object({
  firstName: z
    .string()
    .min(
      2,
      "O limite mínimo de caractéres é 2! Por favor, diminuia e tente novamente.",
    )
    .max(
      50,
      "O limite máximo de caractéres é 50! Por favor, diminuia e tente novamente.",
    ),
  lastName: z
    .string()
    .min(
      2,
      "O limite mínimo de caractéres é 2! Por favor, diminuia e tente novamente.",
    )
    .max(
      50,
      "O limite máximo de caractéres é 50! Por favor, diminuia e tente novamente.",
    ),
  email: z.string().email("Por favor, insira um email válido."),
});

type FormType = z.infer<typeof FormSchema>;

export default function CreateAccountForm() {
  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const { mutate } = api.user.create.useMutation({
    onSuccess: () => {
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
        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
          <Button type="submit">Criar Conta</Button>
          <Link
            href={"/login"}
            className="cursor-pointer text-xs text-primary hover:underline hover:underline-offset-1"
          >
            Fazer Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
