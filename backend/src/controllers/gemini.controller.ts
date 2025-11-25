// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from src/.env (works from both src and dist)
dotenv.config({ path: path.join(__dirname, '../../src/.env') });

export async function processPrompt(completePrompt: string): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const tools = [
    {
      googleSearch: {
      }
    },
  ];
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    tools,
  };
  const model = 'gemini-flash-latest';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: completePrompt,
        },
      ],
    },
  ];

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    
    let fullResponse = '';
    for await (const chunk of response) {
      if (chunk.text) {
        fullResponse += chunk.text;
      }
    }
    return fullResponse;
  } catch (error) {
    console.error('Error in Gemini API:', error);
    throw error;
  }
}

// Keep the main function for direct testing
async function main() {
  const testPrompt = "What is gemini flash latest";
  try {
    const result = await processPrompt(testPrompt);
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Only run main if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
