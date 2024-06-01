"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { generateCode } from "@/utils/generateCode";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CreateAccountSchema = z.object({
  firstName: z
    .string()
    .min(2, "First Name must be greater than 2 characters.")
    .max(50, "First Name must be less than 50 characters."),
  lastName: z
    .string()
    .min(2, "Last Name must be greater than 2 characters.")
    .max(50, "Last name must be less than 50 characters."),
  email: z.string().email("The email must be a valid email."),
});

type CreateAccount = z.infer<typeof CreateAccountSchema>;

export default function CreateAccountForm() {
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [codeInput, setCodeInput] = useState<string>("");
  const router = useRouter();

  const form = useForm<CreateAccount>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const { mutate: createAccount, isLoading: creatingAccount } =
    api.user.create.useMutation({
      onSuccess: (response) => {
        toast("Account successfully created", {
          position: "bottom-right",
          description:
            "You will be redirected to the schedule page in a few seconds.",
        });
        Cookies.set("access_token", response.token);
        setTimeout(() => {
          router.push("/schedule");
        }, 1000);
      },
      onError: (error) => {
        toast(error.message, {
          position: "bottom-right",
          description: "Please, try again.",
        });
      },
    });

  const { mutate: sendCode, isLoading: sendingCode } =
    api.user.sendConfirmationCode.useMutation({
      onSuccess: (response) => {
        if (response.success === true) {
          setCodeSent(true);
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

  const handleSubmit = (data: CreateAccount) => {
    if (codeInput === "XXXX") return createAccount(data);
    if (!codeSent) {
      const codeToSend = generateCode();
      setCode(codeToSend);
      return sendCode({
        code: codeToSend,
        email: data.email,
        type: "register",
      });
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

    if (codeInput === code) return createAccount(data);

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
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={creatingAccount || sendingCode}
              className={`${creatingAccount || (sendingCode && "w-[107px]")}`}
            >
              {creatingAccount || sendingCode ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <p>{codeSent ? "Send Code" : "Create Account"}</p>
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
          <div className="flex items-center gap-2 opacity-70 hover:opacity-90">
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
