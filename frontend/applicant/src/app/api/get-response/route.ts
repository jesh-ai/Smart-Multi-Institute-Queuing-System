import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get the message from query parameters
    const { searchParams } = new URL(request.url);
    const message = searchParams.get('message');

    if (!message) {
      return NextResponse.json(
        { error: 'Message parameter is required' },
        { status: 400 }
      );
    }

    // Path to responses.json
    const responsesPath = path.join(process.cwd(), 'responses.json');

    // Read responses file
    if (!fs.existsSync(responsesPath)) {
      return NextResponse.json(
        { error: 'Responses file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(responsesPath, 'utf-8');
    const responsesData = JSON.parse(fileContent);

    // Determine response key based on message
    const responseKey = determineResponseKey(message, responsesData);
    const response = responsesData[responseKey] || responsesData.default;

    // Build choices array
    const choices: string[] = [];
    if (response.Choices && typeof response.Choices === 'object') {
      const choicesObj = response.Choices as Record<string, string>;
      for (let i = 1; i <= 4; i++) {
        const choiceKey = `Choice${i}`;
        if (choicesObj[choiceKey]) {
          choices.push(choicesObj[choiceKey]);
        }
      }
    }

    return NextResponse.json({
      message: response.Message,
      choices,
      error: response.Errors || '',
    });
  } catch (error) {
    console.error('Error fetching response:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to determine response key
function determineResponseKey(message: string, responsesData: Record<string, unknown>): string {
  const lowerMessage = message.toLowerCase().trim();

  // Priority 1: Check if message matches any choice text from responses (exact match)
  for (const [responseKey, responseData] of Object.entries(responsesData)) {
    if (responseData && typeof responseData === 'object') {
      const data = responseData as Record<string, unknown>;
      if (data.Choices && typeof data.Choices === 'object') {
        const choiceValues = Object.values(data.Choices);
        for (const choiceText of choiceValues) {
          if (typeof choiceText === 'string' && lowerMessage === choiceText.toLowerCase()) {
            // Match found - determine which response to return
            if (choiceText.toLowerCase().includes('clearance')) return 'clearance';
            if (choiceText.toLowerCase().includes('other')) return 'other';
            if (choiceText.toLowerCase().includes('passport application')) return 'default';
            if (choiceText.toLowerCase().includes('passport record')) return 'default';
            if (choiceText.toLowerCase().includes('queue status')) return 'default';
            if (choiceText.toLowerCase().includes('appointment')) return 'default';
            if (choiceText.toLowerCase().includes('representative')) return 'default';
            if (
              choiceText.toLowerCase().includes('poor') ||
              choiceText.toLowerCase().includes('fair') ||
              choiceText.toLowerCase().includes('good') ||
              choiceText.toLowerCase().includes('excellent')
            )
              return 'default';
            return responseKey;
          }
        }
      }
    }
  }

  // Priority 2: Check for keyword matches in message
  const initialKeywords: { [key: string]: string[] } = {
    greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'welcome'],
    inquiry: ['inquire', 'inquiry', 'ask', 'question'],
    assistToday: ['assist', 'help', 'support'],
    experience: ['experience', 'feedback', 'rate', 'review'],
  };

  for (const [key, keywords] of Object.entries(initialKeywords)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      return key;
    }
  }

  // Default response
  return 'default';
}
