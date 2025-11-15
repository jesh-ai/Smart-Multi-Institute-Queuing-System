// CRUD operations for Session Responses
import db from "../config/database.js";
// CREATE - Save a response
export function createResponse(sessionId, questionKey, answer) {
    const stmt = db.prepare(`
    INSERT INTO session_responses (session_id, question_key, answer)
    VALUES (?, ?, ?)
  `);
    try {
        const info = stmt.run(sessionId, questionKey, answer);
        return { success: true, responseId: info.lastInsertRowid };
    }
    catch (error) {
        console.error("Error creating response:", error);
        return { success: false, error: error.message };
    }
}
// READ - Get all responses for a session
export function getSessionResponses(sessionId) {
    const stmt = db.prepare(`
    SELECT * FROM session_responses 
    WHERE session_id = ? 
    ORDER BY created_at ASC
  `);
    try {
        return stmt.all(sessionId);
    }
    catch (error) {
        console.error("Error getting session responses:", error);
        return [];
    }
}
// READ - Get specific response
export function getResponse(sessionId, questionKey) {
    const stmt = db.prepare(`
    SELECT * FROM session_responses 
    WHERE session_id = ? AND question_key = ?
    ORDER BY created_at DESC
    LIMIT 1
  `);
    try {
        return stmt.get(sessionId, questionKey) || null;
    }
    catch (error) {
        console.error("Error getting response:", error);
        return null;
    }
}
// READ - Get responses as key-value object
export function getSessionResponsesObject(sessionId) {
    const responses = getSessionResponses(sessionId);
    const responseObj = {};
    responses.forEach(r => {
        responseObj[r.question_key] = r.answer;
    });
    return responseObj;
}
// UPDATE - Update a response (creates new record, keeps history)
export function updateResponse(sessionId, questionKey, newAnswer) {
    // We keep history by creating a new record instead of updating
    return createResponse(sessionId, questionKey, newAnswer);
}
// DELETE - Delete all responses for a session
export function deleteSessionResponses(sessionId) {
    const stmt = db.prepare(`
    DELETE FROM session_responses WHERE session_id = ?
  `);
    try {
        const info = stmt.run(sessionId);
        return { success: true, deletedCount: info.changes };
    }
    catch (error) {
        console.error("Error deleting session responses:", error);
        return { success: false, error: error.message };
    }
}
// DELETE - Delete specific response
export function deleteResponse(responseId) {
    const stmt = db.prepare(`
    DELETE FROM session_responses WHERE response_id = ?
  `);
    try {
        const info = stmt.run(responseId);
        return { success: info.changes > 0 };
    }
    catch (error) {
        console.error("Error deleting response:", error);
        return { success: false, error: error.message };
    }
}
