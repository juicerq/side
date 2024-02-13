"use client";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Email } from "../../server/api/utils/Email";
import { generateCode } from "../utils/generateCode";
import { Label } from "../components/ui/label";

const FormSchema = z.object({
  email: z.string().email("The email must be a valid email."),
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

  const { mutate: login, isLoading: loging } = api.user.login.useMutation({
    onSuccess: (response) => {
      Cookies.set("access_token", response.token);
      form.reset();
      setTimeout(() => {
        router.push("/");
      }, 500);
    },
    onError: (err: { message: string }) => {
      toast(err.message, {
        description: "Please, try again.",
        position: "bottom-center",
      });
    },
  });

  const { mutate: sendCode, isLoading: sendingCode } =
    api.user.sendConfirmationCode.useMutation({
      onSuccess: (response) => {
        if (response.success === true) {
          setCodeSended(true);
          toast(response.message, {
            description: response.description ?? "",
            position: "bottom-center",
          });
        }
      },
      onError: (err) => {
        toast(err.message, {
          description: "Check the informations and try again.",
          position: "bottom-center",
        });
      },
    });

  const handleSubmit = (data: FormType) => {
    if (!codeSended) {
      const codeToSend = generateCode();
      setCode(codeToSend);
      return sendCode({ code: codeToSend, email: data.email, type: "login" });
    }

    if (codeSended && codeInput === "") {
      return toast("Please, enter the code.", {
        position: "bottom-center",
        description: "The code cannot be empty.",
      });
    }

    if (codeSended && codeInput !== code) {
      return toast("The code is not correct.", {
        position: "bottom-center",
        description: "Please, check the code and try again.",
      });
    }

    if (codeInput === code) {
      return login(data);
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
            <Label htmlFor="code">Code</Label>
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
            className={`${(loging || sendingCode) && "w-[54px]"}`}
          >
            {loging || sendingCode ? (
              <Loader2 className="h-4 w-4 animate-spin" />
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
