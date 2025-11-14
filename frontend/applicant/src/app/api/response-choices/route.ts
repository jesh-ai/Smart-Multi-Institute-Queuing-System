import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const responsesPath = path.join(process.cwd(), 'responses.json');
    
    if (!fs.existsSync(responsesPath)) {
      return NextResponse.json({ error: 'Responses file not found' }, { status: 404 });
    }
    
    const content = fs.readFileSync(responsesPath, 'utf-8');
    const json = JSON.parse(content);
    return NextResponse.json(json);
  } catch (err) {
    console.error('response-choices error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
