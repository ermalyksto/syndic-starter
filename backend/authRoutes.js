import express from "express";

const router = express.Router();

router.post("/api/v1/auth/login-email", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Mock response for demonstration
  res.json({
    qrUrl: "http://example.com/qr-code",
    user: { id: "123", email },
  });
});

export default router;
