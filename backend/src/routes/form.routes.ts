import { Router } from 'express';
import { startForm, submitForm, getFormResponses } from '../controllers/form.controller.js';

const router = Router();

// Start a form - fetch form JSON
router.get('/start/:formReference', startForm);

// Submit form responses
router.post('/submit/:sessionId', submitForm);

// Get form responses for current session
router.get('/responses', getFormResponses);

export default router;
