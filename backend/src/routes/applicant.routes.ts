import { Router } from "express";
import {
  getApplicantInfo,
  getApplicantBySessionId,
  updateApplicantInfo,
  submitApplicantForm,
  markApplicantServed,
  submitFeedback,
  getAllApplicants,
  deleteApplicantInfo,
} from "../controllers/applicant.controller.js";

const router = Router();

router.get("/info", getApplicantInfo);

router.post("/submit", submitApplicantForm);
router.put("/served", markApplicantServed);
router.put("/process", markApplicantServed)

router.post("/feedback", submitFeedback);

// TBR
router.get("/info/:sessionId", getApplicantBySessionId);
router.get("/all", getAllApplicants);
router.put("/update", updateApplicantInfo);
router.put("/served/:sessionId", markApplicantServed);
router.delete("/info", deleteApplicantInfo);

export default router;
