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
import { useState } from "react";
import { Email } from "../utils/Email";
import { generateRandomString } from "../utils/generateRandomString";
import { Label } from "./ui/label";

const FormSchema = z.object({
  firstName: z
    .string()
    .min(2, "Nome deve ser maior que 2 caracteres.")
    .max(50, "Nome deve ser menor que 50 caracteres."),
  lastName: z
    .string()
    .min(2, "Sobrenome deve ser maior que 2 caracteres.")
    .max(50, "Sobrenome deve ser menor que 50 caracteres."),
  email: z.string().email("Email não é válido."),
});

type FormType = z.infer<typeof FormSchema>;

export default function CreateAccountForm() {
  const [codeSended, setCodeSended] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [codeInput, setCodeInput] = useState<string>("");
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
        position: "bottom-center",
        description: "Please, try again.",
      });
    },
  });

  const handleSubmit = (data: FormType) => {
    // Acho que vou ter que passar pra api o email e o code
    if (!codeSended) {
      const codeToSend = generateRandomString();
      setCode(codeToSend);
      Email.send({
        code: codeToSend,
        userEmail: data.email,
      }).catch((err: {message: string}) => toast(err.message, {
        position: "bottom-center",
      }));
      return setCodeSended(true);
    }

    if (codeSended && codeInput === "") {
      toast("Please, enter the code.", {
        position: "bottom-center",
        description: "The code cannot be empty.",
      });
      return;
    }

    if (codeSended && codeInput !== code) {
      toast("The code is not correct.", {
        position: "bottom-center",
        description: "Please, check the code and try again.",
      });
    }

    if (codeInput === code) {
      return mutate(data);
    }

    toast("Something went wrong!", {
      position: "bottom-center",
      description: "It's probably a bug. Sorry!",
    });
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
        {codeSended && (
          <div className="space-y-2">
            <Label htmlFor="code">Code sended to your email</Label>
            <Input
              id="code"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
            />
          </div>
        )}
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isLoading}
            className={`${isLoading && "w-[129px]"}`}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <p>{codeSended ? "Send Code" : "Create Account"}</p>
            )}
          </Button>
          <Button type="button" variant={"ghost"}>
            <Link
              href={"/login"}
              className="cursor-pointer text-xs text-primary"
            >
              Login
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
