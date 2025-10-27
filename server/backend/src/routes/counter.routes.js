import express from "express";
import { deleteCounter, getCounterId, getCounters, postCounter, putCounter } from "../controllers/counter.controller.js"; 

const sessionRoutes = express.Router();

sessionRoutes.get("/counters", getCounters);
sessionRoutes.post("/counters", express.json(), postCounter);
sessionRoutes.put("/counters/:id", express.json(), putCounter);
sessionRoutes.delete("/counters/:id", deleteCounter);
sessionRoutes.get("/counters/:id", getCounterId);

export default sessionRoutes;