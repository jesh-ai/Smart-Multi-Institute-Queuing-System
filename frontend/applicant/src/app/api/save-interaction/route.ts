import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userMessage, botResponse, messageType, timestamp } = body;

    // Path to store interactions
    const interactionsPath = path.join(process.cwd(), 'interactions.json');

    // Read existing interactions or create empty array
    let interactions = [];
    if (fs.existsSync(interactionsPath)) {
      const fileContent = fs.readFileSync(interactionsPath, 'utf-8');
      interactions = JSON.parse(fileContent);
    }

    // Add new interaction
    interactions.push({
      userMessage,
      botResponse,
      messageType,
      timestamp: timestamp || new Date().toISOString(),
    });

    // Save back to file
    fs.writeFileSync(interactionsPath, JSON.stringify(interactions, null, 2));

    return NextResponse.json({ success: true, message: 'Interaction saved' });
  } catch (error) {
    console.error('Error saving interaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save interaction' },
      { status: 500 }
    );
  }
}
