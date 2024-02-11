/* eslint-disable */

type SendEmail = { code: string; userEmail: string };
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";

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
        apiKey:
          "E60DC0809E97D93B52241F07D1C2F2D97DF84F973861D6844D7BC71C7594B8175609EBBFF95866A7BABBE7459AE19995",
        subject: "Code",
        from: "julio.cerqueiira@gmail.com",
        to: userEmail,
        bodyHtml: `<h1>${code}</h1>`,
      },
    }).catch((err) => toast(err.message, { position: "bottom-center" }));

    const parsedRes = resSchema.parse(res);

    if (parsedRes.data.success === false) {
      toast("Error when sendind email", { position: "bottom-center" });
    } else if (!parsedRes.data.success) {
      toast("Error when sendind email", { position: "bottom-center" });
    }

    return toast("Code sent!", { position: "bottom-center" });
  },
};
