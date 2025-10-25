import session from "express-session";
import { storeSession } from "../db/sessions.js";
import { randomUUID } from "crypto";

// import SQLiteStoreFactory from "connect-sqlite3";
// const SQLiteStore = SQLiteStoreFactory(session);

const isProd = process.env.NODE_ENV === "production";

export const sessionMiddleware = session({
  name: "connect.sid",
  // store: new SQLiteStore({ db: "sessions.sqlite", dir: "./data" }),
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
  if (!req.session.deviceId) {
    req.session.deviceId = process.env.DEVICE_ID_PREFIX
      ? `${process.env.DEVICE_ID_PREFIX}-${randomUUID()}`
      : randomUUID();
    req.session.dateCreated = new Date().toISOString();

    req.session.save((err) => {
      if (err) console.error("Failed saving session:", err);
      console.warn("New session created", req.sessionID, req.session.deviceId);
      storeSession(req.sessionID, req.session);
      next();
    });
    return;
  }

  storeSession(req.sessionID, req.session);
  next();
}
