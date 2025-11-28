import express from "express";
import { getAllSessions, getCurrentSession, getSessions, removeSession } from "../controllers/session.controller.js";

const sessionRoutes = express.Router();

sessionRoutes.delete("/:sessionId", removeSession); 

sessionRoutes.get("/all", getSessions); 
sessionRoutes.get("/all-d", getAllSessions); 
sessionRoutes.get("/self", getCurrentSession);

export default sessionRoutes;
