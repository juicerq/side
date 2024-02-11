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
import { useState } from "react";
import { Email } from "../utils/Email";
import { generateRandomString } from "../utils/generateRandomString";
import { Label } from "./ui/label";

const FormSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
});

type FormType = z.infer<typeof FormSchema>;

export function LoginUser() {
  const [codeSended, setCodeSended] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [codeInput, setCodeInput] = useState<string>("");
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
      setTimeout(() => {
        router.push("/");
      }, 500);
    },
    onError: (error) => {
      toast(error.message, {
        description: "Please, try again.",
        position: "bottom-center",
      });
    },
  });

  const handleSubmit = (data: FormType) => {
    if (!codeSended) {
      const codeToSend = generateRandomString();
      setCode(codeToSend);
      Email.send({
        code: codeToSend,
        userEmail: data.email,
      }).catch((err) =>
        toast(err.message, {
          position: "bottom-center",
        }),
      );
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
          <Button type="submit" className={`${isLoading && "w-[67px]"}`}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
          <Button type="button" variant={"ghost"}>
            <Link
              href={"/register"}
              className="cursor-pointer text-xs text-primary"
            >
              New Account
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
