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
async function main() {
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
          text: `What is gemini flash latest`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = 0;
  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

main();
