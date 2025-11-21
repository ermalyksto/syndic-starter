import { defineMock, MockOptions } from "vite-plugin-mock-dev-server";
import { auth } from "./auth/auth";
import { assemblies } from "./assemblies/assemblies";
import properties from "./properties/_GET.json";
import owners from "./owners.json";
import invitations from "./invitations/_GET.json";

export default defineMock([
  ...auth,
  ...assemblies,
  {
    url: "/api/invitations/:assemblyId",
    method: "POST",
    body: { invitationsSent: true },
  },
    {
    url: "/api/protocol/:assemblyId",
    method: "POST",
    body: { assemblyFinalized: true },
  },
  {
    url: "/api/invitations/:id",
    method: "GET",
    body: (req) => {
      const invitationId = req.params.id || req.params[0];
      console.log("Fetching invitation:", invitationId);
      
      // Find the invitation by ID
      const invitation = invitations.find(inv => inv.id === invitationId);
      
      if (!invitation) {
        return {
          success: false,
          error: "Invitation not found"
        };
      }
      
      return {
        success: true,
        data: {
          id: invitation.id,
          assembly: invitation.assembly,
          senderName: invitation.senderName,
          createdAt: new Date().toISOString(),
          status: "pending"
        }
      };
    }
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