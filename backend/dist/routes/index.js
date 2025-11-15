// src/routes/index.js
import { Router } from 'express';
import QRCode from 'qrcode';
import testRoutes from './test.routes.js';
import templatesRoutes from './templates.js';
import sessionRoutes from './session.routes.js';
import serverRoutes from './server.routes.js';
import counterRoutes from './counter.routes.js';
import applicantRoutes from './applicant.routes.js';
const router = Router();
// Example QR Code generator
router.get("/qr", async (req, res) => {
    try {
        const url = "http://localhost:4000/test.html";
        const qrDataUrl = await QRCode.toDataURL(url);
        res.json({ qr: qrDataUrl });
    }
    catch (err) {
        console.error("QR Error:", err);
        res.status(500).json({ error: "Failed to generate QR" });
    }
});
router.use(sessionRoutes);
router.use(serverRoutes);
router.use(counterRoutes);
router.use(applicantRoutes);
// Applicant chatbot route
// router.use("/chatbot", applicantRoutes);
// Templates/object data routes
router.use("/templates", templatesRoutes);
// Test/debug routes (for development only)
router.use("/test", testRoutes);
export default router;
