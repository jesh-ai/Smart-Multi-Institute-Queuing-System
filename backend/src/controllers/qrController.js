import { generateQRCode } from '../utils/generateQR.js';
import pendingVerification from '../models/pendingVerification.js';

// GET /api/qr
export async function getQRCode(req, res) {
  try {
    const data = `http://localhost:4000/api/qr/connect`; // URL encoded in QR
    const qrImage = await generateQRCode(data);
    res.json({ qrImage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/qr/connect
export async function connectClient(req, res) {
  try {
    const clientInfo = {
      ip: req.ip,
      timestamp: new Date(),
      status: 'pending'
    };
    pendingVerification.add(clientInfo);
    res.json({ message: 'Client added to pending verification', clientInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/qr/pending
export async function listPending(req, res) {
  res.json(pendingVerification.list());
}
