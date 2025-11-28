import express from "express";
import { getCurrentSession, getSessions, getSessionsList, removeSession } from "../controllers/session.controller.js";

const sessionRoutes = express.Router();

sessionRoutes.get("/all", getSessionsList); // FIXME: this is counter only
sessionRoutes.delete("/:sessionId", removeSession); // TODO: Change implementation

sessionRoutes.get("/devices", getSessions); // TODO: rename to all
sessionRoutes.get("/self", getCurrentSession);

export default sessionRoutes;
