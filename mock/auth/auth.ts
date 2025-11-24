import { MockOptions } from "vite-plugin-mock-dev-server";
import qr_syndic from "./login-email_syndic_POST.json";
import qr_coowner from "./login-email_coowner_POST.json";
import syndic from "./login_syndic_POST.json";
import coowner from "./login_coowner_POST.json";

export const auth: MockOptions = [
  {
    url: "/api/v1/auth/login-email",
    method: "POST",
    body: (req) => {
      const { email } = req.body;

      const qr = email === "owner@prop.bg" ? qr_coowner : qr_syndic;

      return qr;
    },
  },
  {
    url: "/api/v1/auth/login",
    method: "POST",
    body: (req) => {
      const { email } = req.body;

      const response = email === "owner@prop.bg" ? coowner : syndic;

      return response;
    },
  },
]