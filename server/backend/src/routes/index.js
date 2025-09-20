// src/routes/index.js
import { Router } from 'express';
import QRCode from 'qrcode';

const router = Router();

// simple QR code API
router.get('/qr', async (req, res) => {
  try {
    // This is the URL the QR will contain (e.g., your test page)
    const url = 'http://localhost:4000/test.html';

    // Generate a Data URL (base64 PNG)
    const qrDataUrl = await QRCode.toDataURL(url);

    // send JSON with the QR code
    res.json({ qr: qrDataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate QR' });
  }
});

export default router;
