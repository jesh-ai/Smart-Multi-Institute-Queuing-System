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
    const s = String(raw).split(',')[0].trim();
    return s || null;
  }

  const forwarded = req.headers && (req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For']);
  const ipFromHeader = forwarded ? String(forwarded).split(',')[0].trim() : null;
  const reqIp = req.ip || null;
  const connIp = (req.connection && req.connection.remoteAddress) || (req.socket && req.socket.remoteAddress) || null;
  const rawIp = ipFromHeader || reqIp || connIp || null;
  const cleanIp = normalizeIp(rawIp);

  const secFetchMode = (req.headers && (req.headers['sec-fetch-mode'] || req.headers['Sec-Fetch-Mode'])) || '';
  const secFetchDest = (req.headers && (req.headers['sec-fetch-dest'] || req.headers['Sec-Fetch-Dest'])) || '';
  const isNavigation = secFetchMode === 'navigate' || secFetchDest === 'document';
  if (hasCookie || isNavigation) {
    if (wasMissingDate) req.session.dateCreated = new Date().toISOString();
    if (wasMissingDevice) req.session.deviceId = `device-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    if (cleanIp) req.session.ip = cleanIp;
    req.session.save((err) => {
      if (err) console.error("Error saving session:", err);
      else if (isFirstSave) console.debug("Session saved", req.sessionID, req.session.deviceId);
      next();
    });
    return;
  }

  next();
}