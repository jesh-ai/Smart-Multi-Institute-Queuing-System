import express from "express";
import { getIsServer } from "../controllers/server.controller.js";
import { getQR } from "../controllers/qr.controller.js";

const routes = express.Router();

routes.get("/check", getIsServer);
// routes.get("/dashboard")
// routes.get("/devices");
// routes.get("/session");
// routes.get("/queue")
routes.get("/qr", getQR)
// routes.post("/shutdown")

const serverRoutes = routes;
export default serverRoutes;