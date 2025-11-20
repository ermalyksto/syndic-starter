import { MockOptions } from "vite-plugin-mock-dev-server";
import coowner_meetings from "./coowner_GET.json";
import syndic_meetings from "./syndic_GET.json";
import stats from "./stats_GET.json";
import { coownerId } from "../constants";
import { Assembly } from "../../src/types";

export const assemblies: MockOptions = [
  {
    url: "/api/assemblies",
    method: "POST",
    body: {created: true}
  },
  {
    url: "/api/assemblies/user/:id",
    body: (req) => {
      const { id } = req.params;
      const meetings =
        id == coownerId ? coowner_meetings : syndic_meetings;
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
    url: "/api/assemblies/:id/vote",
    method: "POST",
    body: {}
  },
    {
    url: "/api/assemblies/:id/delegate",
    method: "POST",
    body: {}
  }
]