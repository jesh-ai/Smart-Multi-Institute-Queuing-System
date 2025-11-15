import fs from "fs";
import path from "path";
/**
 * Create a new conversation context and messages files for a given sessionId.
 * The files will be stored in /backend/convos as session_<id>_context.json and session_<id>_messages.json
 */
export const createContext = (req, res) => {
    try {
        const { sessionId } = req.params; // sessionId passed as route parameter
        if (!sessionId) {
            return res.status(400).json({ error: "Session ID is required" });
        }
        // Build file paths
        const convosDir = path.join(process.cwd(), "convos");
        const contextFilePath = path.join(convosDir, `session_${sessionId}_context.json`);
        const messagesFilePath = path.join(convosDir, `session_${sessionId}_messages.json`);
        // Ensure convos directory exists
        if (!fs.existsSync(convosDir)) {
            fs.mkdirSync(convosDir, { recursive: true });
        }
        // Create context file structure
        const contextData = {
            [sessionId]: {
                timestamp: new Date().toISOString(),
                context: "",
                lastMessages: {
                    1: { u: "", b: "" },
                    2: { u: "", b: "" },
                    3: { u: "", b: "" }
                }
            }
        };
        // Create messages file with placeholder structure following interactions.json format
        const messagesData = [
            {
                userMessage: "",
                botResponse: {
                    Message: "",
                    Choices: {},
                    Errors: ""
                },
                messageType: "open",
                timestamp: ""
            },
            {
                userMessage: "",
                botResponse: {
                    Message: "",
                    Choices: {},
                    Errors: ""
                },
                messageType: "open",
                timestamp: ""
            },
            {
                userMessage: "",
                botResponse: {
                    Message: "",
                    Choices: {},
                    Errors: ""
                },
                messageType: "open",
                timestamp: ""
            }
        ];
        // Write files
        fs.writeFileSync(contextFilePath, JSON.stringify(contextData, null, 2), { flag: "w" });
        fs.writeFileSync(messagesFilePath, JSON.stringify(messagesData, null, 2), { flag: "w" });
        return res.status(201).json({
            message: "Context and messages files created successfully",
            contextFile: `session_${sessionId}_context.json`,
            messagesFile: `session_${sessionId}_messages.json`,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to create conversation files" });
    }
};
/**
 * Update the lastMessages object in the context file with the last 3 messages from the messages file
 */
export const updateMessages = (req, res) => {
    try {
        const { sessionId } = req.params; // sessionId passed as route parameter
        if (!sessionId) {
            return res.status(400).json({ error: "Session ID is required" });
        }
        // Build file paths
        const convosDir = path.join(process.cwd(), "convos");
        const contextFilePath = path.join(convosDir, `session_${sessionId}_context.json`);
        const messagesFilePath = path.join(convosDir, `session_${sessionId}_messages.json`);
        // Check if files exist
        if (!fs.existsSync(contextFilePath) || !fs.existsSync(messagesFilePath)) {
            return res.status(404).json({ error: "Context or messages file not found" });
        }
        // Read files
        const contextData = JSON.parse(fs.readFileSync(contextFilePath, 'utf8'));
        const messagesData = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));
        // Get last 3 messages (filter out empty ones and get the most recent)
        const validMessages = messagesData.filter(msg => msg.userMessage && msg.botResponse.Message);
        const last3Messages = validMessages.slice(-3);
        // Update lastMessages in context
        const updatedLastMessages = {
            1: { u: "", b: "" },
            2: { u: "", b: "" },
            3: { u: "", b: "" }
        };
        last3Messages.forEach((msg, index) => {
            const position = index + 1;
            updatedLastMessages[position] = {
                u: msg.userMessage,
                b: msg.botResponse.Message
            };
        });
        // Update context data
        contextData[sessionId].lastMessages = updatedLastMessages;
        contextData[sessionId].timestamp = new Date().toISOString(); // Update timestamp
        // Write updated context back to file
        fs.writeFileSync(contextFilePath, JSON.stringify(contextData, null, 2));
        return res.status(200).json({
            message: "Last messages updated successfully",
            lastMessages: updatedLastMessages
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update messages" });
    }
};
export const getMessages = (req, res) => {
    try {
        const { sessionId } = req.params; // sessionId passed as route parameter
        if (!sessionId) {
            return res.status(400).json({ error: "Session ID is required" });
        }
        // Build file path
        const convosDir = path.join(process.cwd(), "convos");
        const messagesFilePath = path.join(convosDir, `session_${sessionId}_messages.json`);
        // Check if file exists
        if (!fs.existsSync(messagesFilePath)) {
            return res.status(404).json({ error: "Messages file not found" });
        }
        // Read and parse the messages file
        const data = fs.readFileSync(messagesFilePath, 'utf8');
        const messagesData = JSON.parse(data);
        return res.status(200).json({
            sessionId: sessionId,
            messages: messagesData
        });
    }
    catch (error) {
        console.error(`Error reading messages file for session ${req.params.sessionId}:`, error);
        return res.status(500).json({ error: "Failed to read messages file" });
    }
};
