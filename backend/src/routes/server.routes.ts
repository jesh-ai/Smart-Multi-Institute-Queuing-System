import express from "express";
import { getIsServer } from "../controllers/server.controller.js";

const routes = express.Router();

routes.get("/check", getIsServer);
// routes.get("/dasboard")
// routes.get("/devices");
// routes.get("/session");
// routes.get("/queue")
// routes.get("/qr")
// routes.post("/shutdown")

const serverRoutes = routes;
export default serverRoutes;