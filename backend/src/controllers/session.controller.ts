import { Request, Response } from "express";
import { fetchSessions, deleteSession } from "../db/sessions.js";
import { getAvailableKeys } from "../utils/counterKeys.js";

export async function getSessions(req: Request, res: Response): Promise<void> {
    const obj = Object.fromEntries(fetchSessions());
    res.json(obj);
}

export async function getCurrentSession(req: Request, res: Response): Promise<void> {
  res.json(fetchSessions().get(req.sessionID));
}
export async function removeSession(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      res.status(400).json({ error: "Session ID is required" });
      return;
    }

    // Check if session exists
    const sessions = fetchSessions();
    if (!sessions.has(sessionId)) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    // Delete the session (moves to backup)
    deleteSession(sessionId);
    
    res.json({ message: "Session deleted successfully", sessionId });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete session",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
