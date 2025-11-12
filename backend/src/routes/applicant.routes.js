import express from "express";
import {createConversation} from "../controllers/applicant/createConversation.js";


const applicantRoutes = express.Router();
applicantRoutes.post("/createConversation/:sessionId", createConversation);
export default applicantRoutes;