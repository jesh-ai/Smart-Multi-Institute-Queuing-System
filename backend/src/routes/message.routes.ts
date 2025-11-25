import { Router } from 'express';
import { sendMessage, getMessages, getContext } from '../controllers/message.controller.js';

const router = Router();

// POST /api/sendMessage/:sessionId - Send a message to the virtual assistant
router.post('/sendMessage/:sessionId', sendMessage);

// GET /api/messages/:sessionId - Get all messages for a session
router.get('/messages/:sessionId', getMessages);

// GET /api/context/:sessionId - Get context for a session
router.get('/context/:sessionId', getContext);

export default router;