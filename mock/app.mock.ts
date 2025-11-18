import { defineMock } from "vite-plugin-mock-dev-server";

import qr from "./auth/login-email_POST.json";
import meetings from "./assemblies/_GET.json";
import stats from "./assemblies/stats_GET.json";

export default defineMock([
  {
    url: "/api/auth/login-email",
    method: "POST",
    body: qr,
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
