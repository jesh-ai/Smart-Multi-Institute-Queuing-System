import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { processPrompt } from './gemini.controller.js';

// Get current directory for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_BASE_PATH = path.join(__dirname, '../../configs');
const DATA_BASE_PATH = path.join(__dirname, '../../data', 'convos');

interface MessageStructure {
  VA_Personality: string;
  General_Instruction: string;
  Start_Instruction: string;
  Response_Format: {
    botResponse: {
      Message: string;
      Choices: {};
      Errors: string;
    };
    lastMessages: {
      [key: string]: { u: string; b: string };
    };
  };
  Error_Message: string;
}

interface InstituteInfo {
  name: string;
  welcome_message: string;
  service_list: Array<{
    name: string;
    requirements: string[];
    form: string;
  }>;
}

interface BotResponse {
  Message: string;
  Choices: {};
  Errors: string;
}

interface MessageEntry {
  userMessage: string;
  botResponse: BotResponse;
  messageType: string;
  timestamp: string;
}

interface ContextData {
  [sessionId: string]: {
    timestamp: string;
    context: string;
    lastMessages: {
      [key: string]: { u: string; b: string };
    };
  };
}

// Load configuration files
const loadMessageStructure = (): MessageStructure => {
  try {
    const filePath = path.join(CONFIG_BASE_PATH, 'message_structure.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading message structure:', error);
    throw new Error('Failed to load message structure configuration');
  }
};

const loadInstituteInfo = (): InstituteInfo => {
  try {
    const filePath = path.join(CONFIG_BASE_PATH, 'institute_info.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading institute info:', error);
    throw new Error('Failed to load institute information');
  }
};

// Context and messages file management
const ensureConvosDirectory = (): void => {
  if (!fs.existsSync(DATA_BASE_PATH)) {
    fs.mkdirSync(DATA_BASE_PATH, { recursive: true });
  }
};

const createSessionFiles = (sessionId: string): void => {
  const contextFilePath = path.join(DATA_BASE_PATH, `session_${sessionId}_context.json`);
  const messagesFilePath = path.join(DATA_BASE_PATH, `session_${sessionId}_messages.json`);

  // Create context file structure
  const contextData: ContextData = {
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

  // Create messages file with placeholder structure
  const messagesData: MessageEntry[] = [
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
};

const sessionFilesExist = (sessionId: string): boolean => {
  const contextFilePath = path.join(DATA_BASE_PATH, `session_${sessionId}_context.json`);
  const messagesFilePath = path.join(DATA_BASE_PATH, `session_${sessionId}_messages.json`);
  return fs.existsSync(contextFilePath) && fs.existsSync(messagesFilePath);
};

const updateMessagesFile = (sessionId: string, userMessage: string, botResponse: BotResponse): void => {
  const messagesFilePath = path.join(DATA_BASE_PATH, `session_${sessionId}_messages.json`);
  
  let messagesData: MessageEntry[];
  
  if (fs.existsSync(messagesFilePath)) {
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    messagesData = JSON.parse(data);
  } else {
    messagesData = [];
  }

  // Add new message entry
  const newEntry: MessageEntry = {
    userMessage: userMessage,
    botResponse: botResponse,
    messageType: "conversation",
    timestamp: new Date().toISOString()
  };

  messagesData.push(newEntry);

  // Write updated messages back to file
  fs.writeFileSync(messagesFilePath, JSON.stringify(messagesData, null, 2));
};

const updateContextFile = (sessionId: string): void => {
  const contextFilePath = path.join(DATA_BASE_PATH, `session_${sessionId}_context.json`);
  const messagesFilePath = path.join(DATA_BASE_PATH, `session_${sessionId}_messages.json`);

  if (!fs.existsSync(contextFilePath) || !fs.existsSync(messagesFilePath)) {
    return;
  }

  // Read files
  const contextData: ContextData = JSON.parse(fs.readFileSync(contextFilePath, 'utf8'));
  const messagesData: MessageEntry[] = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));

  // Get last 3 valid messages
  const validMessages = messagesData.filter(msg => msg.userMessage && msg.botResponse.Message);
  const last3Messages = validMessages.slice(-3);

  // Update lastMessages in context
  const updatedLastMessages = {
    1: { u: "", b: "" },
    2: { u: "", b: "" },
    3: { u: "", b: "" }
  };

  last3Messages.forEach((msg, index) => {
    const position = (index + 1) as 1 | 2 | 3;
    if (position <= 3) {
      updatedLastMessages[position] = {
        u: msg.userMessage,
        b: msg.botResponse.Message
      };
    }
  });

  // Update context data
  contextData[sessionId].lastMessages = updatedLastMessages;
  contextData[sessionId].timestamp = new Date().toISOString();

  // Write updated context back to file
  fs.writeFileSync(contextFilePath, JSON.stringify(contextData, null, 2));
};

const constructCompletePrompt = (userMessage: string, sessionId: string, isFirstMessage: boolean = false): string => {
  const messageStructure = loadMessageStructure();
  const instituteInfo = loadInstituteInfo();

  let prompt = `${messageStructure.VA_Personality}\n\n`;
  prompt += `${messageStructure.General_Instruction}\n\n`;

  if (isFirstMessage) {
    prompt += `${messageStructure.Start_Instruction}\n\n`;
    prompt += `Institute Context:\n`;
    prompt += `Name: ${instituteInfo.name}\n`;
    prompt += `Welcome Message: ${instituteInfo.welcome_message}\n`;
    prompt += `Available Services:\n`;
    instituteInfo.service_list.forEach((service, index) => {
      prompt += `${index + 1}. ${service.name}\n`;
      prompt += `   Requirements: ${service.requirements.join(', ')}\n`;
    });
  } else {
    // Add conversation context for continuing messages
    const contextFilePath = path.join(DATA_BASE_PATH, `session_${sessionId}_context.json`);
    if (fs.existsSync(contextFilePath)) {
      const contextData: ContextData = JSON.parse(fs.readFileSync(contextFilePath, 'utf8'));
      const sessionContext = contextData[sessionId];
      if (sessionContext && sessionContext.lastMessages) {
        prompt += `Previous conversation context:\n`;
        Object.entries(sessionContext.lastMessages).forEach(([key, messages]) => {
          if (messages.u && messages.b) {
            prompt += `User: ${messages.u}\n`;
            prompt += `Bot: ${messages.b}\n`;
          }
        });
      }
    }
  }

  prompt += `\nCurrent user message: "${userMessage}"\n\n`;
  prompt += `Response Format (JSON):\n`;
  prompt += JSON.stringify(messageStructure.Response_Format.botResponse, null, 2);

  return prompt;
};

// Gemini API call function
const callGeminiAPI = async (completePrompt: string): Promise<BotResponse> => {
  try {
    // Call Gemini API with the complete prompt
    const response = await processPrompt(completePrompt);
    
    // Try to parse JSON response from Gemini
    let parsedResponse: BotResponse;
    try {
      // Look for JSON in the response
      const jsonMatch = response?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        parsedResponse = {
          Message: parsed.Message || parsed.message || response,
          Choices: parsed.Choices || parsed.choices || {},
          Errors: parsed.Errors || parsed.errors || ""
        };
      } else {
        // If no JSON found, use the raw response as the message
        parsedResponse = {
          Message: response || "Hello! I'm AIvin, your virtual queuing assistant. How can I help you today?",
          Choices: {},
          Errors: ""
        };
      }
    } catch (parseError) {
      parsedResponse = {
        Message: response || "Hello! I'm AIvin, your virtual queuing assistant. How can I help you today?",
        Choices: {},
        Errors: ""
      };
    }
    
    return parsedResponse;
  } catch (error) {
    console.error('Gemini API error:', error);
    const messageStructure = loadMessageStructure();
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      Message: messageStructure.Error_Message,
      Choices: {},
      Errors: errorMessage
    };
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }



    // Ensure convos directory exists
    ensureConvosDirectory();

    // Check if session files exist, create if they don't
    const isFirstMessage = !sessionFilesExist(sessionId);
    if (isFirstMessage) {
      createSessionFiles(sessionId);
    }

    // Construct the complete prompt
    const completePrompt = constructCompletePrompt(message, sessionId, isFirstMessage);

    // Call Gemini API with the complete prompt
    const botResponse = await callGeminiAPI(completePrompt);

    // Update messages file
    updateMessagesFile(sessionId, message, botResponse);

    // Update context file
    updateContextFile(sessionId);

    return res.status(200).json({
      success: true,
      sessionId: sessionId,
      botResponse: botResponse,
      timestamp: new Date().toISOString(),
      filesCreated: isFirstMessage ? ['context', 'messages'] : [],
      filesUpdated: ['messages', 'context']
    });

  } catch (error) {
    console.error('Send message error:', error);
    const messageStructure = loadMessageStructure();
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return res.status(500).json({
      error: "Failed to process message",
      botResponse: {
        Message: messageStructure.Error_Message,
        Choices: {},
        Errors: errorMessage
      }
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    // Build file path
    const messagesFilePath = path.join(DATA_BASE_PATH, `session_${sessionId}_messages.json`);

    // Check if file exists
    if (!fs.existsSync(messagesFilePath)) {
      return res.status(404).json({ error: "Messages file not found" });
    }

    // Read and parse the messages file
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    const messagesData = JSON.parse(data);

    return res.status(200).json({
      success: true,
      sessionId: sessionId,
      messages: messagesData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`Error reading messages file for session ${req.params.sessionId}:`, error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return res.status(500).json({ 
      error: "Failed to read messages file",
      details: errorMessage
    });
  }
};

export const getContext = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    // Build file path
    const contextFilePath = path.join(DATA_BASE_PATH, `session_${sessionId}_context.json`);

    // Check if file exists
    if (!fs.existsSync(contextFilePath)) {
      return res.status(404).json({ error: "Context file not found" });
    }

    // Read and parse the context file
    const data = fs.readFileSync(contextFilePath, 'utf8');
    const contextData = JSON.parse(data);

    return res.status(200).json({
      success: true,
      sessionId: sessionId,
      context: contextData[sessionId] || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`Error reading context file for session ${req.params.sessionId}:`, error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return res.status(500).json({ 
      error: "Failed to read context file",
      details: errorMessage
    });
  }
};
