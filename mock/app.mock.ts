import { defineMock, MockOptions } from "vite-plugin-mock-dev-server";
import { auth } from "./auth/auth";
import { assemblies } from "./assemblies/assemblies";
import properties from "./properties/_GET.json";
import owners from "./owners.json";

export default defineMock([
  ...auth,
  ...assemblies,
  {
    url: "/api/invitations/:assemblyId",
    method: "POST",
    body: { invitationsSent: true },
  },
  {
    url: "/api/properties/:id",
    body: (req) => {
      const id = req.params[0];
      console.log("Property owner", id);
      return properties;
    }
  },
  {
    url: "/api/owners/:id",
    method: "GET",
    body: (req) => {
      const id = req.params.id || req.params[0];
      console.log("Fetching owners for user:", id);
      // Return all owners for the given user id
      // In a real scenario, you might filter based on user permissions
      return {
        success: true,
        data: owners,
        total: owners.length
      };
    }
  },
  {
    url: "/api/owners/:id/property/:propertyId",
    method: "GET",
    body: (req) => {
      const userId = req.params.id || req.params[0];
      const propertyId = req.params.propertyId || req.params[1];
      console.log("Fetching owners for user:", userId, "and property:", propertyId);
      
      // Filter owners by property id
      const filteredOwners = owners.filter(owner => owner.propertyId === propertyId);
      
      return {
        success: true,
        data: filteredOwners,
        total: filteredOwners.length,
        propertyId: propertyId
      };
    }
  },
]);