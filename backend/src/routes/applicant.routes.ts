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
router.get("/info/:sessionId", getApplicantBySessionId);
router.get("/all", getAllApplicants);
router.post("/submit", submitApplicantForm);
router.put("/update", updateApplicantInfo);
router.put("/served", markApplicantServed);
router.put("/served/:sessionId", markApplicantServed);
router.post("/feedback", submitFeedback);
router.delete("/info", deleteApplicantInfo);

export default router;
