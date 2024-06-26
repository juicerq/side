"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox } from "../components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { generateCode } from "../utils/generateCode";

const FormSchema = z.object({
  email: z.string().email("The email must be a valid email."),
});

type FormType = z.infer<typeof FormSchema>;

export function LoginUser() {
  const [codeSent, setcodeSent] = useState<boolean>(false);
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
      setTimeout(() => {
        router.push("/schedule");
      }, 500);
    },
    onError: (err) => {
      toast(err.message, {
        position: "bottom-right",
        description: "Please, try again.",
      });
    },
  });

  const { mutate: sendCode, isLoading: sendingCode } =
    api.user.sendConfirmationCode.useMutation({
      onSuccess: (response) => {
        if (response.success === true) {
          setcodeSent(true);
          toast("Code sent successfully", {
            position: "bottom-right",
            description: "It will probably be in your spam box.",
          });
        }
      },
      onError: (err) => {
        toast(err.message, {
          position: "bottom-right",
          description: "Please, try again.",
        });
      },
    });

  const handleSubmit = (data: FormType) => {
    if (codeInput === "XXXX") return login(data);

    if (!codeSent) {
      const codeToSend = generateCode();
      setCode(codeToSend);
      return sendCode({ code: codeToSend, email: data.email, type: "login" });
    }

    if (codeSent && codeInput === "") {
      return toast("Please, enter the code.", {
        position: "bottom-right",
        description: "The code cannot be empty.",
      });
    }

    if (codeSent && codeInput !== code) {
      return toast("The code is not correct.", {
        position: "bottom-right",
        description: "Please, check the code and try again.",
      });
    }

    if (codeInput === code) return login(data);

    toast("Something went wrong!", {
      position: "bottom-right",
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

        <div className="space-y-2">
          <Label htmlFor="code" className={!codeSent ? "opacity-50" : ""}>
            Code
          </Label>
          <Input
            id="code"
            value={codeInput}
            disabled={!codeSent}
            onChange={(e) => setCodeInput(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button type="submit" className="min-w-16">
              {loging || sendingCode ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <p>
                  {codeSent || codeInput === "XXXX" ? "Login" : "Send code"}
                </p>
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
          <div className="flex items-center gap-2">
            <Checkbox
              id="codeIgnore"
              onCheckedChange={(e) =>
                e.valueOf() ? setCodeInput("XXXX") : setCodeInput("")
              }
            />
            <Label htmlFor="codeIgnore" className="cursor-pointer">
              Ignore code
            </Label>
          </div>
        </div>
      </form>
    </Form>
  );
}
