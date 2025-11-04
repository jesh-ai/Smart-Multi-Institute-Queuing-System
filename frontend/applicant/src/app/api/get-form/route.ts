import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const formPath = path.join(process.cwd(), 'src', 'app', 'forms', 'bir_1901.json');
    if (!fs.existsSync(formPath)) {
      return NextResponse.json({ error: 'Form definition not found' }, { status: 404 });
    }
    const content = fs.readFileSync(formPath, 'utf-8');
    const json = JSON.parse(content);
    return NextResponse.json(json);
  } catch (err) {
    console.error('get-form error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
