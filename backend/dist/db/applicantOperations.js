// CRUD operations for Applicants
import db from "../config/database.js";
// CREATE - Register new applicant (PII minimized)
export function createApplicant(name, contact, piiMinimized = null) {
    const stmt = db.prepare(`
    INSERT INTO applicants (name, contact, pii_minimized)
    VALUES (?, ?, ?)
  `);
    try {
        const info = stmt.run(name, contact, piiMinimized);
        return { success: true, applicantId: info.lastInsertRowid };
    }
    catch (error) {
        console.error("Error creating applicant:", error);
        return { success: false, error: error.message };
    }
}
// READ - Get applicant by ID
export function getApplicant(applicantId) {
    const stmt = db.prepare(`
    SELECT * FROM applicants WHERE applicant_id = ?
  `);
    try {
        const applicant = stmt.get(applicantId);
        return applicant || null;
    }
    catch (error) {
        console.error("Error getting applicant:", error);
        return null;
    }
}
// READ - Search applicant by contact
export function findApplicantByContact(contact) {
    const stmt = db.prepare(`
    SELECT * FROM applicants WHERE contact = ? ORDER BY created_at DESC LIMIT 1
  `);
    try {
        const applicant = stmt.get(contact);
        return applicant || null;
    }
    catch (error) {
        console.error("Error finding applicant by contact:", error);
        return null;
    }
}
// UPDATE - Update applicant information
export function updateApplicant(applicantId, name, contact, piiMinimized = null) {
    const stmt = db.prepare(`
    UPDATE applicants 
    SET name = ?, contact = ?, pii_minimized = ?
    WHERE applicant_id = ?
  `);
    try {
        const info = stmt.run(name, contact, piiMinimized, applicantId);
        return { success: info.changes > 0 };
    }
    catch (error) {
        console.error("Error updating applicant:", error);
        return { success: false, error: error.message };
    }
}
// DELETE - Remove applicant (hard delete)
export function deleteApplicant(applicantId) {
    const stmt = db.prepare(`
    DELETE FROM applicants WHERE applicant_id = ?
  `);
    try {
        const info = stmt.run(applicantId);
        return { success: info.changes > 0 };
    }
    catch (error) {
        console.error("Error deleting applicant:", error);
        return { success: false, error: error.message };
    }
}
