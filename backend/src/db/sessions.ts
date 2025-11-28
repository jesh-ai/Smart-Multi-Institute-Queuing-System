import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { SessionData } from "express-session";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, "sessions.db"));
const backupDb = new Database(path.join(dataDir, "sessions_backup.db"));

db.prepare(`CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, expired INTEGER, sess TEXT)`).run();
backupDb.prepare(`CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, expired INTEGER, sess TEXT, deleted_at INTEGER)`).run();

const DEFAULT_TTL_SECONDS = parseInt(process.env.SESSION_TTL || "86400", 10);

interface SessionRow {
  id: string;
  data: string;
}

export function fetchSessions(): Map<string, SessionData> {
  const rows = db.prepare("SELECT sid AS id, sess AS data FROM sessions").all() as SessionRow[];
  return new Map(
    rows.map((r) => {
      try {
        return [r.id, JSON.parse(r.data) as SessionData];
      } catch (e) {
        return [r.id, r.data as any];
      }
    })
  );
}
export function fetchSessionsAll(): Map<string, SessionData | (SessionData & { deleted_at: number })> {
  const mainRows = db.prepare("SELECT sid AS id, sess AS data FROM sessions").all() as SessionRow[];
  const backupRows = backupDb.prepare("SELECT sid AS id, sess AS data, deleted_at FROM sessions").all() as Array<{ id: string; data: string; deleted_at: number }>;

  const allSessions = new Map<string, SessionData | (SessionData & { deleted_at: number })>();

  for (const r of mainRows) {
    try {
      allSessions.set(r.id, JSON.parse(r.data) as SessionData);
    } catch (e) {
      allSessions.set(r.id, r.data as any);
    }
  }

  for (const r of backupRows) {
    if (!allSessions.has(r.id)) {
      try {
        const sessionData = JSON.parse(r.data) as SessionData;
        allSessions.set(r.id, { ...sessionData, deleted_at: r.deleted_at });
      } catch (e) {
        allSessions.set(r.id, { deleted_at: r.deleted_at } as any);
      }
    }
  }

  return allSessions;
}

export function storeSession(sessionID: string, session: SessionData): void {
  const ttlMs = DEFAULT_TTL_SECONDS * 1000;
  const expiry = Date.now() + ttlMs;

  db.prepare(`INSERT OR REPLACE INTO sessions (sid, sess, expired) VALUES (?, ?, ?)`).run(
    sessionID,
    JSON.stringify(session),
    expiry
  );
}

export function findSessionsByUserAgent(userAgent: string): Array<{ id: string; data: SessionData }> {
  const rows = db.prepare("SELECT sid AS id, sess AS data FROM sessions").all() as SessionRow[];
  const matches: Array<{ id: string; data: SessionData }> = [];
  for (const row of rows) {
    try {
      const sessionData = JSON.parse(row.data) as SessionData;
      if (sessionData.deviceId && sessionData.deviceId.includes(userAgent)) {
        matches.push({ id: row.id, data: sessionData });
      }
    } catch (e) {
    }
  }
  return matches;
}

export function deleteSession(sessionID: string): void {
  const session = db.prepare("SELECT sid, sess, expired FROM sessions WHERE sid = ?").get(sessionID) as { sid: string; sess: string; expired: number } | undefined;
  
  if (session) {
    backupDb.prepare(`INSERT OR REPLACE INTO sessions (sid, sess, expired, deleted_at) VALUES (?, ?, ?, ?)`).run(
      session.sid,
      session.sess,
      session.expired,
      Date.now()
    );
  }
  
  db.prepare("DELETE FROM sessions WHERE sid = ?").run(sessionID);
}

export function getBackupSessions(): Map<string, SessionData & { deleted_at: number }> {
  const rows = backupDb.prepare("SELECT sid AS id, sess AS data, deleted_at FROM sessions").all() as Array<{ id: string; data: string; deleted_at: number }>;
  return new Map(
    rows.map((r) => {
      try {
        const sessionData = JSON.parse(r.data) as SessionData;
        return [r.id, { ...sessionData, deleted_at: r.deleted_at }];
      } catch (e) {
        return [r.id, { deleted_at: r.deleted_at } as any];
      }
    })
  );
}

export function clearBackupSessions(olderThanMs?: number): number {
  if (olderThanMs) {
    const cutoff = Date.now() - olderThanMs;
    const result = backupDb.prepare("DELETE FROM sessions WHERE deleted_at < ?").run(cutoff);
    return result.changes;
  } else {
    const result = backupDb.prepare("DELETE FROM sessions").run();
    return result.changes;
  }
}
