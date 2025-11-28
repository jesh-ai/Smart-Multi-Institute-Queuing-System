import express from "express";
import { getCurrentSession, getSessions, getSessionsList, removeSession } from "../controllers/session.controller.js";

const sessionRoutes = express.Router();

sessionRoutes.get("/devices", getSessions);
sessionRoutes.get("/self", getCurrentSession);

// TBR
sessionRoutes.get("/all", getSessionsList);
sessionRoutes.delete("/:sessionId", removeSession);

export default sessionRoutes;
