// backend/src/controllers/applicant/createConversation.js
import fs from "fs";
import path from "path";

/**
 * Create a new conversation log file for a given sessionId.
 * The file will be stored in /backend/convos as session_<id>.txt
 */
export const createConversation = (req, res) => {
  try {
    const { sessionId } = req.params; // sessionId passed as route parameter

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    // Build file path
    const convosDir = path.join(process.cwd(), "convos");
    const filePath = path.join(convosDir, `session_${sessionId}.txt`);

    // Ensure convos directory exists
    if (!fs.existsSync(convosDir)) {
      fs.mkdirSync(convosDir, { recursive: true });
    }

    // Create empty file or add initial content
    const initialContent = `Conversation started for session: ${sessionId}\nTimestamp: ${new Date().toISOString()}\n\n`;
    fs.writeFileSync(filePath, initialContent, { flag: "w" });

    return res.status(201).json({
      message: "Conversation file created successfully",
      file: `session_${sessionId}.txt`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create conversation file" });
  }
};
