// src/routes/index.js
import { Router } from 'express';
import QRCode from 'qrcode';
import { getCurrentSession } from './session.routes.js';
import { fetchSessions } from '../db/sessions.js';
import { deleteCounterRoute, getCounterId, getCounters, postCounter, putCounter } from './counterSession.routes.js';
import express from "express";
import { getDeviceMac, getLocalMac } from './devices.routes.js';
import { getMAC } from 'node-arp';

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

/**
 * Chat, is this good enough?
 * Yes — comparing req.socket.localAddress (server IP) and req.socket.remoteAddress (client IP) is a valid, clean, and sufficient method to detect if the request came from the same machine as the server.

✅ Works well when

You’re running inside a local LAN or development environment.

Both addresses are IPv4 (the .replace("::ffff:", "") line normalizes them).

You just want to distinguish “server device vs other clients”.

⚠️ Limitations

Behind a proxy or load balancer, both may resolve to 127.0.0.1 or the proxy’s IP — all clients might appear identical unless you use X-Forwarded-For.

If the system uses IPv6, the IPs may not match string-for-string (e.g., ::1 vs 127.0.0.1).

If NAT or VPN is involved, multiple devices could share one IP.
 */
router.get("/server/check", async (req, res) => {
  const serverIp =
  req.socket.localAddress?.replace("::ffff:", "") || "unknown";
const clientIp =
  req.headers["x-forwarded-for"]?.split(",")[0] ||
  req.socket.remoteAddress?.replace("::ffff:", "") ||
  "unknown";

console.warn("Server IP:", serverIp, "Client IP:", clientIp);
res.json({ isServer: serverIp === clientIp });

});

export default router;
