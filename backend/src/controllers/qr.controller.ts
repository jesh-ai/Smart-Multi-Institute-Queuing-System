import QRCode from 'qrcode';
import { Request, Response } from 'express';

export async function getQR(req: Request, res: Response) {
  try {
    const url = req.query.url || req.body.url;
    
    if (!url) {
      return res.status(400).json({ error: "URL parameter is required" });
    }
    
    const qrDataUrl = await QRCode.toDataURL(url as string);
    res.json({ qr: qrDataUrl });
  } catch (err) {
    console.error("QR Error:", err);
    res.status(500).json({ error: "Failed to generate QR" });
  }
};