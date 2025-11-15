import express from "express";
import { createContext, updateMessages, getMessages } from "../controllers/applicantContext.js";
const applicantRoutes = express.Router();
applicantRoutes.post("/createContext/:sessionId", createContext);
applicantRoutes.post("/updateMessages/:sessionId", updateMessages);
applicantRoutes.post("/getMessages/:sessionId", getMessages);
export default applicantRoutes;
