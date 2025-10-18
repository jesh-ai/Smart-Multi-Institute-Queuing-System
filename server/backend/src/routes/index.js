import { Router } from "express";
import QRCode from "qrcode";
import applicantRoutes from "../applicant/ApplicantRoutes.js";

const router = Router();

// Example QR Code generator
router.get("/qr", async (req, res) => {
  try {
    const url = "http://localhost:4000/test.html";
    const qrDataUrl = await QRCode.toDataURL(url);
    res.json({ qr: qrDataUrl });
  } catch (err) {
    console.error("QR Error:", err);
    res.status(500).json({ error: "Failed to generate QR" });
  }
});

// Applicant chatbot route
router.use("/chatbot", applicantRoutes);

export default router;
