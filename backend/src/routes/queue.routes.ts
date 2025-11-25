import { Router } from "express";
import {
  getQueueStatus,
  getApplicantPosition,
  getNextApplicant,
  getCounterQueue,
  getAllQueueItems,
} from "../controllers/queue.controller.js";

const router = Router();

router.get("/status", getQueueStatus);
router.get("/all", getAllQueueItems);
router.get("/applicant/:sessionId", getApplicantPosition);
router.get("/counter/next", getNextApplicant);
router.get("/counter/:counterId", getCounterQueue);

export default router;
