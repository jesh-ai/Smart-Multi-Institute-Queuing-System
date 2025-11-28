import { Router } from "express";
import {
  activateCounter,
  closeCounter,
  getAvailableKeysHandler,
} from "../controllers/counter.controller.js";

const router = Router();

router.post("/close", closeCounter);
router.post("/activate", activateCounter);
router.get("/keys", getAvailableKeysHandler);

// TBR
// router.get("/all", getAllCounters);
// router.get("/info", getCounterInfo);
// router.get("/info/:sessionId", getCounterBySessionId);
// router.get("/active", getActiveCounters);
// router.post("/serve", serveApplicant);
// router.post("/missing", markApplicantMissing);
// router.post("/close-request", closeApplicantRequest);
// router.post("/logout", logoutCounter);
// router.put("/update", updateCounterInfo);
// router.delete("/info", deleteCounterInfo);

export default router;
