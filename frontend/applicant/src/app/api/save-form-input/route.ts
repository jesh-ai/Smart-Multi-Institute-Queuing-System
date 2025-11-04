import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = body?.data ?? null;
    const form = body?.form ?? 'unknown';

    if (!data) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // write into public/form_input.json (overwrites)
    const outPath = path.join(process.cwd(), 'public', 'form_input.json');
    const payload = { form, timestamp: new Date().toISOString(), data };
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf-8');

    return NextResponse.json({ ok: true, path: '/form_input.json' });
  } catch (err) {
    console.error('save-form-input error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
