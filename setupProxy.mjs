import express from "express";
import mockApi from "./src/services/mockApi";

export default function setupProxy(app) {
  const router = express.Router();

  // Mock login with email
  router.post("/api/auth/login-email", (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Use mockApi to simulate the response
    res.json({
      qrUrl: "http://example.com/qr-code",
      user: { id: "123", email },
    });
  });

  // Mock other endpoints (e.g., assemblies, properties)
  router.get("/api/assemblies", (req, res) => {
    res.json(mockApi.getAssembliesMock());
  });

  router.get("/api/properties", (req, res) => {
    res.json(mockApi.getPropertiesMock());
  });

  app.use(router);
}
