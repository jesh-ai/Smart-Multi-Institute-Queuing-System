import express from 'express';
import { getQRCode, connectClient, listPending } from '../controllers/qrController.js';
const router = express.Router();
// generate QR
router.get('/', getQRCode);
// called after scanning
router.post('/connect', connectClient);
// optional debug: see pending clients
router.get('/pending', listPending);
export default router;
