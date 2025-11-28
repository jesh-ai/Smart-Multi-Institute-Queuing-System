import { Router } from "express";
import {
  activateCounter,
  closeCounter,
  getAllCounters,
} from "../controllers/counter.controller.js";

const router = Router();

router.get("/all", getAllCounters);
router.post("/close", closeCounter);
router.post("/activate", activateCounter);

// TBR
// router.get("/info", getCounterInfo);
// router.get("/info/:sessionId", getCounterBySessionId);
// router.get("/active", getActiveCounters);
// router.get("/keys", getAvailableKeysHandler);
// router.post("/serve", serveApplicant);
// router.post("/missing", markApplicantMissing);
// router.post("/close-request", closeApplicantRequest);
// router.post("/logout", logoutCounter);
// router.put("/update", updateCounterInfo);
// router.delete("/info", deleteCounterInfo);

export default router;
