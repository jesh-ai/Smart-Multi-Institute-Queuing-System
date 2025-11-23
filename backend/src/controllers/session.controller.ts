import { Request, Response } from "express";
import { fetchSessions } from "../db/sessions.js";

export async function getSessions(req: Request, res: Response): Promise<void> {
    const obj = Object.fromEntries(fetchSessions());
    res.json(obj);
}

export async function getCurrentSession(req: Request, res: Response): Promise<void> {
  res.json(fetchSessions().get(req.sessionID));
}
