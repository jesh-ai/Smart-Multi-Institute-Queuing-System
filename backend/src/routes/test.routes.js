// Test routes for database inspection
import { Router } from "express";
import {
  getAllInstitutes,
  getAllServices,
} from "../db/serviceOperations.js";
import {
  getActiveSessions,
  getSession,
} from "../db/sessionOperations.js";
import {
  getAllWaitingQueue,
} from "../db/queueOperations.js";
import db from "../config/database.js";

const router = Router();

// Get all institutes
router.get("/institutes", (req, res) => {
  try {
    const institutes = getAllInstitutes();
    res.json({ success: true, data: institutes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all services
router.get("/services", (req, res) => {
  try {
    const services = getAllServices();
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get active sessions
router.get("/sessions", (req, res) => {
  try {
    const sessions = getActiveSessions();
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get waiting queue
router.get("/queue", (req, res) => {
  try {
    const queue = getAllWaitingQueue(50);
    res.json({ success: true, data: queue });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get database stats
router.get("/stats", (req, res) => {
  try {
    const stats = {
      institutes: db.prepare("SELECT COUNT(*) as count FROM institutes").get(),
      services: db.prepare("SELECT COUNT(*) as count FROM services").get(),
      sessions: db.prepare("SELECT COUNT(*) as count FROM sessions").get(),
      queue: db.prepare("SELECT COUNT(*) as count FROM queue").get(),
      applicants: db.prepare("SELECT COUNT(*) as count FROM applicants").get(),
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all tables
router.get("/tables", (req, res) => {
  try {
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `).all();
    res.json({ success: true, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
