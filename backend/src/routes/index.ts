// src/routes/index.js
import { Router } from 'express';
import * as QRCode from 'qrcode';
import templatesRoutes from './templates.js';
import sessionRoutes from './session.routes.js';
import serverRoutes from './server.routes.js';
import counterRoutes from './counter.routes.js';
import applicantRoutes from './applicant.routes.js'
import intituteRoutes from "./institute.routes.js"
import queueRoutes from "./queue.routes.js"
import messageRoutes from './message.routes.js';
import formRoutes from './form.routes.js';

const router = Router();

router.use("/session", sessionRoutes)
router.use("/institute", intituteRoutes)
router.use("/server", serverRoutes)
router.use("/queue", queueRoutes)
router.use("/applicant", applicantRoutes)
router.use("/counter", counterRoutes)
router.use("/form", formRoutes)
router.use(messageRoutes)
router.use("/", messageRoutes)

// Applicant chatbot route
// router.use("/chatbot", applicantRoutes);

// Templates/object data routes
router.use("/templates", templatesRoutes);

export default router;
