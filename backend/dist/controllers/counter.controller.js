import * as counterManager from "../utils/counterManager.js";
async function setupCounter(req, res, next) {
    try {
        const { counterId, entryId, formEntries } = req.body;
        if (!counterId || !entryId) {
            return res.status(400).json({ message: 'counterId and entryId required' });
        }
        const assigned = counterManager.assignEntryToCounter(counterId, {
            entryId,
            formEntries
        });
        return res.status(200).json({
            message: 'Entry assigned to counter',
            counter: assigned
        });
    }
    catch (err) {
        // if counter busy
        return res.status(409).json({ message: err.message });
    }
}
async function completeTransaction(req, res, next) {
    try {
        const { counterId } = req.body;
        if (!counterId)
            return res.status(400).json({ message: 'counterId required' });
        const { counter, finished } = counterManager.completeTransaction(counterId);
        return res.status(200).json({
            message: 'Transaction completed, counter is now vacant',
            counter,
            finished
        });
    }
    catch (err) {
        return res.status(409).json({ message: err.message });
    }
}
function getCounter(req, res) {
    const { counterId } = req.params;
    if (counterId) {
        const c = counterManager.getCounter(counterId);
        if (!c)
            return res.status(404).json({ message: 'Not found' });
        return res.json(c);
    }
    return res.json(counterManager.listCounters());
}
import { createCounter, delCounter, fetchCounterSessions, updateCounter } from "../db/counters.js";
import { fetchSessions, storeSession } from "../db/sessions.js";
import { Counter } from "../models/counter.model.js";
export function getCounters(req, res) {
    res.json(fetchCounterSessions());
}
export function postCounter(req, res) {
    const counterId = `counter-${Date.now()}`;
    const dateCreated = new Date().toISOString();
    const c = new Counter("", dateCreated, "inactive", counterId);
    createCounter(c);
    res.json({ message: "Counter created", counterId });
}
export function putCounter(req, res) {
    const sessionId = req.params.id;
    const counters = fetchCounterSessions();
    if (!counters || !counters[sessionId])
        return res.status(404).json({ error: "Counter not found" });
    updateCounter(sessionId, req.body.counter || {});
    res.json({ message: "Counter updated", sessionId });
}
export function deleteCounter(req, res) {
    const sessionId = req.params.id;
    const counters = fetchCounterSessions();
    if (!counters || !counters[sessionId])
        return res.status(404).json({ error: "Counter not found" });
    delCounter(sessionId);
    res.json({ message: "Counter deleted", sessionId });
}
function getDeviceId(req) {
    return req.sessionID || null;
}
export async function getCounterId(req, res) {
    const id = req.params.id;
    const counters = fetchCounterSessions();
    if (!counters || !counters[id])
        return res.status(404).json({ error: "Invalid key" });
    const counter = counters[id];
    const sid = getDeviceId(req);
    if (req.session) {
        req.session.userType = "counter";
        try {
            await new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err)
                        return reject(err);
                    resolve();
                });
            });
        }
        catch (e) {
            console.error("Error saving express session:", e);
        }
    }
    counter.sessionId = sid;
    counter.status = "Active";
    updateCounter(id, counter);
    const devices = fetchSessions();
    const device = devices.get(sid) || req.session || { deviceId: req.session?.deviceId };
    if (sid)
        storeSession(sid, device);
    res.json(counter);
}
