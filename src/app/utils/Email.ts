/* eslint-disable */

type SendEmail = { code: string; userEmail: string };
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";
import { env } from "@/env";

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
        apiKey: env.NEXT_PUBLIC_ELASTICMAIL_API_KEY,
        subject: "Code",
        from: "julio.cerqueiira@gmail.com",
        to: userEmail,
        bodyHtml: `<h1>${code}</h1>`,
      },
    }).catch((err) => toast(err.message, { position: "bottom-center" }));

    const parsedRes = resSchema.parse(res);

    if (parsedRes.data.success === false) {
      toast("Error when sendind email", { position: "bottom-center" });
    }

    return toast("Code sent!", { position: "bottom-center" });
  },
};
