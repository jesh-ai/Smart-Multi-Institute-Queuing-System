import fs from "fs";
import path from "path";
import session from "express-session";
import SQLiteStoreFactory from "connect-sqlite3";

const SQLiteStore = SQLiteStoreFactory(session);
const isProd = process.env.NODE_ENV === "production";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const sessionMiddleware = session({
  name: "connect.sid",
  store: new SQLiteStore({
    db: "sessions.sqlite",
    dir: dataDir,
    ttl: 86400,
  }),
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

export function recordSession(req, res, next) {
  if (!req.session) return next();
  const accept = (req.headers && req.headers.accept) || '';
  const wantsHtml = accept.includes('text/html');
  const cookieHeader = (req.headers && req.headers.cookie) || '';
  const hasCookie = cookieHeader.includes('connect.sid');

  const wasMissingDate = !req.session.dateCreated;
  const wasMissingDevice = !req.session.deviceId;
  const isFirstSave = wasMissingDate || wasMissingDevice || req.session.isNew;

  function normalizeIp(raw) {
    if (!raw) return null;
    let s = String(raw).split(',')[0].trim();
    if (!s) return null;
    if (s.startsWith('[') && s.includes(']')) {
      s = s.slice(1, s.indexOf(']'));
    }
    if (s.includes('%')) s = s.split('%')[0];
    const mMapped = s.match(/::ffff:(\d+\.\d+\.\d+\.\d+)(?::\d+)?$/i);
    if (mMapped) return mMapped[1];
    const mV4 = s.match(/^(\d+\.\d+\.\d+\.\d+)(?::\d+)?$/);
    if (mV4) return mV4[1];
    const m6 = s.match(/^(.*?)(?::(\d+))?$/);
    if (m6) return m6[1] || null;
    return null;
  }

  const forwarded = req.headers && (req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For']);
  const ipFromHeader = forwarded ? String(forwarded).split(',')[0].trim() : null;
  const rawIp = ipFromHeader || req.ip || (req.connection && req.connection.remoteAddress) || null;
  const cleanIp = normalizeIp(rawIp);

  const secFetchMode = (req.headers && (req.headers['sec-fetch-mode'] || req.headers['Sec-Fetch-Mode'])) || '';
  const secFetchDest = (req.headers && (req.headers['sec-fetch-dest'] || req.headers['Sec-Fetch-Dest'])) || '';
  const isNavigation = secFetchMode === 'navigate' || secFetchDest === 'document';
  if (hasCookie || isNavigation) {
    if (wasMissingDate) req.session.dateCreated = new Date().toISOString();
    if (wasMissingDevice) req.session.deviceId = `device-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    if (cleanIp) req.session.ip = cleanIp;
    req.session.lastSeen = new Date().toISOString();
    req.session.save((err) => {
      if (err) console.error("Error saving session:", err);
      else if (isFirstSave) console.debug("Session saved", req.sessionID, req.session.deviceId);
      next();
    });
    return;
  }

  next();
}