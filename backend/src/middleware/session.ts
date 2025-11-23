import fs from "fs";
import path from "path";
import session from "express-session";
import SQLiteStoreFactory from "connect-sqlite3";
import { Request, Response, NextFunction } from "express";
import { findSessionsByUserAgent } from "../db/sessions.js";

declare module "express-session" {
  interface SessionData {
    dateCreated?: string;
    deviceId?: string;
    ip?: string;
    isNew?: boolean;
    
    lastSeen?: string;
    lastPath?: string,

    applicant?: {
      name?: string,
      document?: string,
      isPriority?: boolean;
      dateSubmitted?: string;
      dateServed?: string;
      closedServed?: string;
      feedbackChoice?: string;
      feedbackComments?: string
    };

    counter?: {
      dateClosed?: string;
      dateOpened?: string;
      dateActivated?: string
    }
  }
}

const SQLiteStore = SQLiteStoreFactory(session);
const isProd = process.env.NODE_ENV === "production";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}


export const sessionMiddleware = session({
  name: "connect.sid",
  store: new SQLiteStore({
    db: "sessions.db",
    dir: dataDir,
  }) as any,
  secret: process.env.SESSION_SECRET || "TODO",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000,
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  },
});

export function recordSession(req: Request, res: Response, next: NextFunction): void {
  const s = req.session;
  if (!s) return next();

  const cookie = req.headers.cookie || '';
  const hasCookie = cookie.includes('connect.sid');

  function getIp(): string | null {
    const raw = req.headers['x-forwarded-for'] || req.ip || req.socket?.remoteAddress || '';
    let ip = String(raw).split(',')[0].trim();
    if (ip.startsWith('::ffff:')) ip = ip.slice(7);
    if (['::1', '127.0.0.1', 'localhost'].includes(ip)) return 'localhost';
    return ip || null;
  }

  const ip = getIp();
  const ua = req.headers['user-agent'] || 'unknown';
  const normalizedIp = /^(localhost|192\.168\.|10\.|172\.16\.)/.test(ip || '') ? 'local-machine' : ip;
  const fingerprint = `${normalizedIp}-${ua}`;

  if (!hasCookie) {
    const existing = findSessionsByUserAgent(ua);
    if (existing.length) return next();
  }

  if (!s.dateCreated) s.dateCreated = new Date().toISOString();
  if (!s.deviceId || s.deviceId !== fingerprint) s.deviceId = "fingerprint";
  if (ip) s.ip = ip;

  s.save((err?: Error) => {
    if (err) console.error('Session save error:', err);
    else if (s.isNew) console.debug('Session created', s.id, s.deviceId);
    next();
  });
}
