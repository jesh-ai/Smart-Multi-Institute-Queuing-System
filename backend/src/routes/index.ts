// src/routes/index.js
import { Router } from 'express';
import * as QRCode from 'qrcode';
import testRoutes from './test.routes.js';
import templatesRoutes from './templates.js';
import sessionRoutes from './session.routes.js';
import serverRoutes from './server.routes.js';
import counterRoutes from './counter.routes.js';
import applicantRoutes from './applicant.routes.js'
import intituteRoutes from "./institute.routes.js"

const router = Router();

router.use(applicantRoutes)
router.use(counterRoutes)
router.use("/session", sessionRoutes)
router.use("/institute", intituteRoutes)
router.use("/server", serverRoutes)

// Applicant chatbot route
// router.use("/chatbot", applicantRoutes);

// Templates/object data routes
router.use("/templates", templatesRoutes);

// Test/debug routes (for development only)
router.use("/test", testRoutes);

export default router;
