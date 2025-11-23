import express from "express";
import { getCurrentSession, getSessions } from "../controllers/session.controller.js";

const sessionRoutes = express.Router();

sessionRoutes.get("/devices", getSessions);
sessionRoutes.get("/self", getCurrentSession);

export default sessionRoutes;
