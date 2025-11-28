import { Router } from "express";
import {
  getApplicantInfo,
  submitApplicantForm,
  markApplicantClosed,
  submitFeedback,
  markApplicantProcessing,
  markApplicantMissing,
} from "../controllers/applicant.controller.js";

const router = Router();

router.get("/info", getApplicantInfo);

router.post("/submit", submitApplicantForm);
router.put("/missing", markApplicantMissing);
router.put("/process",  markApplicantProcessing)
router.put("/closed", markApplicantClosed)

router.post("/feedback", submitFeedback);

// TBR
// router.get("/info/:sessionId", getApplicantBySessionId);
// router.get("/all", getAllApplicants);
// router.put("/update", updateApplicantInfo);
// router.put("/served/:sessionId", markApplicantServed);
// router.delete("/info", deleteApplicantInfo);

export default router;
