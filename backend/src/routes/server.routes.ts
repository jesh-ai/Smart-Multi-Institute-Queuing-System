import express from "express";
import { getIsServer, shutdownServer, getDashboardQueue, getActiveUsers, getSummary, getDevices } from "../controllers/server.controller.js";
import { getQR } from "../controllers/qr.controller.js";

const routes = express.Router();

routes.get("/check", getIsServer);
routes.get("/dashboard/queue", getDashboardQueue);
routes.get("/dashboard/users", getActiveUsers);
routes.get("/dashboard/summary", getSummary);
routes.get("/qr", getQR);
routes.post("/shutdown", shutdownServer);


routes.get("/devices", getDevices);

const serverRoutes = routes;
export default serverRoutes;