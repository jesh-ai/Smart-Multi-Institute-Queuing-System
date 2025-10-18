import { createCounter, deleteCounter, fetchCounterSessions, updateCounter } from "../db/counters.js";
import { getDeviceMac, getLocalMac } from "./devices.routes.js";


export function getCounters(req, res) {
  res.json(Object.fromEntries(fetchCounterSessions()));
}

// POST /counters → create a new counter
export function postCounter(req, res) {
  const { sessionId, counter } = req.body;
  if (!sessionId) return res.status(400).json({ error: "sessionId required" });

  counter.mac = ""
  createCounter(sessionId, counter || {});
  res.json({ message: "Counter created", sessionId });
}

// PUT /counters/:id → update existing counter
export function putCounter(req, res) {
  const sessionId = req.params.id;
  const counters = fetchCounterSessions()
  if (!counters.has(sessionId))
    return res.status(404).json({ error: "Counter not found" });

  updateCounter(sessionId, req.body.counter || {});
  res.json({ message: "Counter updated", sessionId });
}

// DELETE /counters/:id → delete a counter
export function deleteCounterRoute(req, res) {
  const sessionId = req.params.id;
  const counters = fetchCounterSessions()
  if (!counters.has(sessionId))
    return res.status(404).json({ error: "Counter not found" });

  deleteCounter(sessionId);
  res.json({ message: "Counter deleted", sessionId });
}