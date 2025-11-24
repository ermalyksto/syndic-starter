import { MockOptions } from "vite-plugin-mock-dev-server";
import coowner_meetings from "./coowner_GET.json";
import syndic_meetings from "./syndic_GET.json";
import stats from "./stats_GET.json";
import { coownerId } from "../constants";
import { Assembly } from "../../src/types";

export const assemblies: MockOptions = [
  {
    url: "/api/v1/assemblies",
    method: "POST",
    body: {created: true}
  },
  {
    url: "/api/v1/assemblies/user/:id",
    body: (req) => {
      const { id } = req.params;
      const meetings =
        id === coownerId ? coowner_meetings : syndic_meetings;
      return meetings;
    },
  },
  {
    url: "/api/v1/assemblies/stats",
    body: stats,
  },
  {
    url: "/api/v1/assemblies/:id",
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
    url: "/api/v1/assemblies/:id/vote",
    method: "POST",
    body: {}
  },
  {
    url: "/api/v1/assemblies/:id/delegate",
    method: "POST",
    body: {}
  },
  {
    url: "/api/v1/assemblies/user/:id/property/:propertyId",
    method: "GET",
    body: (req) => {
      const { id, propertyId } = req.params;
      const meetings = id === coownerId ? coowner_meetings : syndic_meetings;
      const assembliesArray = meetings as Assembly[];
      const filteredAssemblies = assembliesArray.filter((a) => a.propertyId === propertyId);
      return filteredAssemblies;
    },
  }
]