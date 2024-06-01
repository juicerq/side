/* eslint-disable */

type SendEmail = { code: string; userEmail: string };
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

const resSchema = z.object({
  data: z.object({
    success: z.boolean(),
  }),
});

export const Email = {
  async send({ code, userEmail }: SendEmail) {
    const res = await axios({
      method: "POST",
      url: `https://api.elasticemail.com/v2/email/send`,
      params: {
        apiKey: env.ELASTICMAIL_API_KEY,
        subject: "Code",
        from: "julio.cerqueiira@gmail.com",
        to: userEmail,
        bodyHtml: `<h1>${code}</h1>`,
      },
    }).catch((err) => toast(err.message, { position: "bottom-right" }));

    const parsedRes = resSchema.parse(res);

    if (parsedRes.data.success === false) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error when sending email.",
      });
    }

    return {
      success: true,
      message: "The code has been sent to your email!",
    };
  },
};
