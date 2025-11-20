import { defineMock, MockOptions } from "vite-plugin-mock-dev-server";
import properties from "./properties/_GET.json";
import { auth } from "./auth/auth";
import { assemblies } from "./assemblies/assemblies";

// Mock owners data
const owners = [
  { 
    id: 1, 
    name: "Иван Петров", 
    email: "ivan@email.bg", 
    phone: "+359 888 123 456", 
    apartment: "А-12", 
    quota: "2.5%", 
    status: "active",
    propertyId: "prop-1"
  },
  { 
    id: 2, 
    name: "Мария Димитрова", 
    email: "maria@email.bg", 
    phone: "+359 888 234 567", 
    apartment: "Б-05", 
    quota: "3.2%", 
    status: "active",
    propertyId: "prop-1"
  },
  { 
    id: 3, 
    name: "Георги Стоянов", 
    email: "georgi@email.bg", 
    phone: "+359 888 345 678", 
    apartment: "В-18", 
    quota: "2.8%", 
    status: "pending",
    propertyId: "prop-2"
  },
  { 
    id: 4, 
    name: "Елена Николова", 
    email: "elena@email.bg", 
    phone: "+359 888 456 789", 
    apartment: "А-07", 
    quota: "3.0%", 
    status: "active",
    propertyId: "prop-1"
  },
  { 
    id: 5, 
    name: "Димитър Иванов", 
    email: "dimitar@email.bg", 
    phone: "+359 888 567 890", 
    apartment: "Б-22", 
    quota: "2.7%", 
    status: "active",
    propertyId: "prop-2"
  },
];

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