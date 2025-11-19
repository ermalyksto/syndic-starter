import { defineMock } from "vite-plugin-mock-dev-server";

import qr_syndic from "./auth/login-email_syndic_POST.json";
import qr_coowner from "./auth/login-email_coowner_POST.json";
import syndic from "./auth/login_syndic_POST.json";
import coowner from "./auth/login_coowner_POST.json";
// import qr from "./auth/login-email_POST.json";
import coowner_meetings from "./assemblies/coowner_GET.json";
import syndic_meetings from "./assemblies/syndic_GET.json";
import stats from "./assemblies/stats_GET.json";
import properties from "./properties/_GET.json";

interface Assembly {
  id: string;
  title: string;
  status: string;
  date: string;
  time: string;
  participantsCount: number;
  delegatedOwnersCount: number;
  buildingLocation: string;
  agendaItems: AgendaItem[];
}
interface AgendaItem {
  id: string;
  description: string;
  customVotingOptions?: string [];
}

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
    url: "/api/auth/login",
    method: "POST",
    body: (req) => {
      const { email } = req.body;

      const response = email === "owner@prop.bg" ? coowner : syndic;

      return response;
    },
  },
  {
    url: "/api/assemblies",
    body: (req) => {
      const { email } = req.body;

      const meetings =
        email === "owner@prop.bg" ? coowner_meetings : syndic_meetings;

      return meetings;
    },
  },
  {
    url: "/api/assemblies/stats",
    body: stats,
  },
  {
    url: "/api/assemblies/:id",
    method: "GET",
    body: (req) => {
      const { id } = req.params;
      const assembliesArray = coowner_meetings as Assembly[];
      const assembly = assembliesArray.find((a) => a.id === id);

      if (!assembly) {
        return {
          statusCode: 404,
          body: { error: "Assembly not found" },
        };
      }

      return assembly;
    },
  },
  {
    url: "/api/properties/:id",
    body: (req) => {
      const id = req.params[0];
      console.log("Property owner", id);
      return properties;
    }
  },
]);
