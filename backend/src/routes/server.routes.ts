import express from "express";
import { getIsServer, shutdownServer, getDashboardQueue, getActiveUsers, getSummary, getDevices, getCounters } from "../controllers/server.controller.js";
import { getQR } from "../controllers/qr.controller.js";
import { generateKeysHandler } from "../controllers/counter.controller.js";

const routes = express.Router();

routes.get("/check", getIsServer);
routes.get("/dashboard/queue", getDashboardQueue);
routes.get("/dashboard/users", getActiveUsers);
routes.get("/dashboard/summary", getSummary);
routes.get("/qr", getQR);

routes.get("/devices", getDevices);

routes.post("/generate-counter", generateKeysHandler);

routes.post("/shutdown", shutdownServer);

const serverRoutes = routes;
export default serverRoutes;