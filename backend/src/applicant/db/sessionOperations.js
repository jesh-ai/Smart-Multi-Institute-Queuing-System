// CRUD operations for Sessions
import db from "../../config/database.js";
import { v4 as uuidv4 } from "uuid";

// CREATE - Start a new session
export function createSession(applicantId = null, instituteId, serviceId = null, aiThreadId = null) {
  const sessionId = uuidv4();
  
  const stmt = db.prepare(`
    INSERT INTO sessions (session_id, applicant_id, institute_id, service_id, ai_thread_id, status)
    VALUES (?, ?, ?, ?, ?, 'active')
  `);

  try {
    stmt.run(sessionId, applicantId, instituteId, serviceId, aiThreadId);
    return { success: true, sessionId };
  } catch (error) {
    console.error("Error creating session:", error);
    return { success: false, error: error.message };
  }
}

// READ - Get session by ID
export function getSession(sessionId) {
  const stmt = db.prepare(`
    SELECT 
      s.*,
      i.name as institute_name,
      svc.name as service_name
    FROM sessions s
    LEFT JOIN institutes i ON s.institute_id = i.institute_id
    LEFT JOIN services svc ON s.service_id = svc.service_id
    WHERE s.session_id = ?
  `);

  try {
    const session = stmt.get(sessionId);
    return session || null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

// READ - Get all active sessions
export function getActiveSessions() {
  const stmt = db.prepare(`
    SELECT 
      s.*,
      i.name as institute_name,
      svc.name as service_name
    FROM sessions s
    LEFT JOIN institutes i ON s.institute_id = i.institute_id
    LEFT JOIN services svc ON s.service_id = svc.service_id
    WHERE s.status = 'active' 
    ORDER BY s.updated_at DESC
  `);

  try {
    return stmt.all();
  } catch (error) {
    console.error("Error getting active sessions:", error);
    return [];
  }
}

// READ - Get sessions by applicant
export function getSessionsByApplicant(applicantId) {
  const stmt = db.prepare(`
    SELECT 
      s.*,
      i.name as institute_name,
      svc.name as service_name
    FROM sessions s
    LEFT JOIN institutes i ON s.institute_id = i.institute_id
    LEFT JOIN services svc ON s.service_id = svc.service_id
    WHERE s.applicant_id = ?
    ORDER BY s.created_at DESC
  `);

  try {
    return stmt.all(applicantId);
  } catch (error) {
    console.error("Error getting sessions by applicant:", error);
    return [];
  }
}

// UPDATE - Update session service
export function updateSessionService(sessionId, serviceId) {
  const stmt = db.prepare(`
    UPDATE sessions 
    SET service_id = ?, updated_at = strftime('%s', 'now')
    WHERE session_id = ?
  `);

  try {
    const info = stmt.run(serviceId, sessionId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error updating session service:", error);
    return { success: false, error: error.message };
  }
}

// UPDATE - Update AI thread ID
export function updateSessionAIThread(sessionId, aiThreadId) {
  const stmt = db.prepare(`
    UPDATE sessions 
    SET ai_thread_id = ?, updated_at = strftime('%s', 'now')
    WHERE session_id = ?
  `);

  try {
    const info = stmt.run(aiThreadId, sessionId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error updating session AI thread:", error);
    return { success: false, error: error.message };
  }
}

// UPDATE - Update session activity timestamp
export function touchSession(sessionId) {
  const stmt = db.prepare(`
    UPDATE sessions 
    SET updated_at = strftime('%s', 'now')
    WHERE session_id = ?
  `);

  try {
    const info = stmt.run(sessionId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error touching session:", error);
    return { success: false, error: error.message };
  }
}

// UPDATE - Update session status
export function updateSessionStatus(sessionId, status) {
  const validStatuses = ['active', 'completed', 'abandoned', 'expired'];
  
  if (!validStatuses.includes(status)) {
    return { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` };
  }

  const stmt = db.prepare(`
    UPDATE sessions 
    SET status = ?, updated_at = strftime('%s', 'now')
    WHERE session_id = ?
  `);

  try {
    const info = stmt.run(status, sessionId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error updating session status:", error);
    return { success: false, error: error.message };
  }
}

// UPDATE - Complete session
export function completeSession(sessionId) {
  return updateSessionStatus(sessionId, 'completed');
}

// UPDATE - Abandon session
export function abandonSession(sessionId) {
  return updateSessionStatus(sessionId, 'abandoned');
}

// DELETE - Permanently delete session (cascades to responses and queue)
export function deleteSession(sessionId) {
  const stmt = db.prepare(`
    DELETE FROM sessions WHERE session_id = ?
  `);

  try {
    const info = stmt.run(sessionId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error deleting session:", error);
    return { success: false, error: error.message };
  }
}

// UTILITY - Clean up expired sessions (older than specified hours)
export function cleanupExpiredSessions(hoursOld = 24) {
  const cutoffTime = Math.floor(Date.now() / 1000) - (hoursOld * 3600);
  
  const stmt = db.prepare(`
    UPDATE sessions 
    SET status = 'expired', updated_at = strftime('%s', 'now')
    WHERE updated_at < ? AND status = 'active'
  `);

  try {
    const info = stmt.run(cutoffTime);
    console.log(`Expired ${info.changes} inactive sessions`);
    return { success: true, expiredCount: info.changes };
  } catch (error) {
    console.error("Error expiring sessions:", error);
    return { success: false, error: error.message };
  }
}
