import { defineMock } from "vite-plugin-mock-dev-server";

import qr_syndic from "./auth/login-email_syndic_POST.json";
import qr_coowner from "./auth/login-email_coowner_POST.json";
// import qr from "./auth/login-email_POST.json";
import meetings from "./assemblies/_GET.json";
import stats from "./assemblies/stats_GET.json";

export default defineMock([
  {
    url: "/api/auth/login-email",
    method: "POST",
    body: (req) => {
      const { email } = req.body;

      const qr = email === "owner@prop.bg" ? qr_coowner : qr_syndic;

      return qr;
    },
  },
  {
    url: "/api/assemblies",
    body: meetings,
  },
  {
    url: "/api/assemblies/stats",
    body: stats,
  },
]);
