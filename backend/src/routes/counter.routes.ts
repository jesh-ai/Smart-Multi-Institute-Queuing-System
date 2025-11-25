import { Router } from "express";
import {
  getCounterInfo,
  getCounterBySessionId,
  closeCounter,
  activateCounter,
  updateCounterInfo,
  getAllCounters,
  getActiveCounters,
  deleteCounterInfo,
  getAvailableKeysHandler,
  generateKeysHandler,
  serveApplicant,
  markApplicantMissing,
  closeApplicantRequest,
} from "../controllers/counter.controller.js";

const router = Router();

router.get("/info", getCounterInfo);
router.get("/info/:sessionId", getCounterBySessionId);
router.get("/all", getAllCounters);
router.get("/active", getActiveCounters);
router.get("/keys", getAvailableKeysHandler);
router.post("/keys/generate", generateKeysHandler);
router.post("/activate", activateCounter);
router.post("/close", closeCounter);
router.post("/serve", serveApplicant);
router.post("/missing", markApplicantMissing);
router.post("/close-request", closeApplicantRequest);
router.put("/update", updateCounterInfo);
router.delete("/info", deleteCounterInfo);

export default router;
