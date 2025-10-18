// src/routes/index.js
import { Router } from 'express';
import QRCode from 'qrcode';
import { getCurrentSession } from './session.routes.js';
import { fetchSessions } from '../db/sessions.js';
import { deleteCounterRoute, getCounterId, getCounters, postCounter, putCounter } from './counterSession.routes.js';
import express from "express";

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
router.get("/devices", (req, res) => {
  res.json(Array.from(fetchSessions().values()));
});
router.get("/session", getCurrentSession);

router.get("/counters", getCounters);
router.post("/counters", express.json(), postCounter);
router.put("/counters/:id", express.json(), putCounter);
router.delete("/counters/:id", deleteCounterRoute);
router.get("/counters/:id", getCounterId);
router.get("/server/check", async (req, res) => {
  const serverIp = req.socket.localAddress?.replace("::ffff:", "") || "unknown";
  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] ||
  req.socket.remoteAddress?.replace("::ffff:", "") ||
  "unknown";

console.warn("Server IP:", serverIp, "Client IP:", clientIp);
res.json({ isServer: serverIp === clientIp });

});

export default router;
