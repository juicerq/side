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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  const router = useRouter();

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const { mutate, isLoading } = api.user.create.useMutation({
    onSuccess: () => {
      form.reset();
      toast("Account successfully created.", {
        position: "bottom-center",
      });
      setTimeout(() => {
        router.push("/login");
      }, 500);
    },
    onError: (error) => {
      toast(error.message, {
        classNames: {
          toast: "bg-red-500 text-red-100 text-center",
        },
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
        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
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
                <FormLabel>Last Name</FormLabel>
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
          <Button
            type="submit"
            disabled={isLoading}
            className={`${isLoading && "w-[129px]"}`}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>
          <Link
            href={"/login"}
            className="cursor-pointer text-xs text-primary hover:underline hover:underline-offset-1"
          >
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
