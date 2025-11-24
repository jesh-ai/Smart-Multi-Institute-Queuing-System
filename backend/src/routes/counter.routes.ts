import { Router } from "express";
import {
  getCounterInfo,
  getCounterBySessionId,
  openCounter,
  activateCounter,
  updateCounterInfo,
  getAllCounters,
  getActiveCounters,
  deleteCounterInfo,
  getAvailableKeysHandler,
  generateKeysHandler,
} from "../controllers/counter.controller.js";

const router = Router();

router.get("/info", getCounterInfo);
router.get("/info/:sessionId", getCounterBySessionId);
router.get("/all", getAllCounters);
router.get("/active", getActiveCounters);
router.get("/keys", getAvailableKeysHandler);
router.post("/keys/generate", generateKeysHandler);
router.post("/activate", activateCounter);
router.post("/open", openCounter);
router.put("/update", updateCounterInfo);
router.delete("/info", deleteCounterInfo);

export default router;
