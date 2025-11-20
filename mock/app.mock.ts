import { defineMock, MockOptions } from "vite-plugin-mock-dev-server";
import properties from "./properties/_GET.json";
import { auth } from "./auth/auth";
import { assemblies } from "./assemblies/assemblies";


export default defineMock([
  ... auth,
  ...assemblies,
  {
    url: "/api/invitations/:assemblyId",
    method: "POST",
    body: {invitationsSent: true},
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


