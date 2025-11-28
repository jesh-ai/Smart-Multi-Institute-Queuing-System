import express from "express";
import { getCurrentSession, getSessions, removeSession } from "../controllers/session.controller.js";

const sessionRoutes = express.Router();

sessionRoutes.delete("/:sessionId", removeSession); 

sessionRoutes.get("/all", getSessions); 
sessionRoutes.get("/self", getCurrentSession);

export default sessionRoutes;
