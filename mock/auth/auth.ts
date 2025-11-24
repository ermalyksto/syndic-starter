import { MockOptions } from "vite-plugin-mock-dev-server";
import qr_syndic from "./login-email_syndic_POST.json";
import qr_coowner from "./login-email_coowner_POST.json";
import syndic from "./login_syndic_POST.json";
import coowner from "./login_coowner_POST.json";
import init_session_syndic from "./init_session_syndic_POST.json";
import init_session_coowner from "./init_session_coowner_POST.json";
import session_status_syndic from "./sesstion_status_syndic_GET.json"
import session_status_coowner from "./sesstion_status_coowner_GET.json"
import session_status_waiting from "./session_status_waiting_GET.json"

export const auth: MockOptions = [
  // inti session (QR)
  {
    url: "/api/v1/init-session",
    method: "POST",
    body: (req) => {
      const { email } = req.body;

      const qr = init_session_syndic;

      return qr;
    },
  },
  // session status
  {
    url: "/api/v1/session-status/:sessionId",
    body: async (req) => {
      const { sessionId } = req.params;

      const qr = sessionId === "3b9d58ac-d95c-4bcf-ac24-2c65931a17a8" ? session_status_syndic: session_status_coowner;
      // const qr = session_status_waiting;
      // const res = await setTimeout(() => qr, 1000);
      return qr;
    }
  },
  // {
  //   url: "/api/v1/auth/login-email",
  //   method: "POST",
  //   body: (req) => {
  //     const { email } = req.body;

  //     const qr = email === "owner@prop.bg" ? qr_coowner : qr_syndic;

  //     return qr;
  //   },
  // },
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