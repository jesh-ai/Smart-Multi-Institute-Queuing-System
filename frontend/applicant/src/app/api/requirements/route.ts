import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const requirementsPath = path.join(process.cwd(), 'public', 'requirements.json');
    
    if (!fs.existsSync(requirementsPath)) {
      // Return default requirements if file doesn't exist
      return NextResponse.json({
        requirements: [
          "High School Diploma",
          "Certificate of Good Moral Character",
          "Birth Certificate (PSA)",
          "2x2 ID Picture (2 copies)",
          "Medical Clearance",
          "Entrance Exam Result",
        ]
      });
    }
    
    const content = fs.readFileSync(requirementsPath, 'utf-8');
    const json = JSON.parse(content);
    return NextResponse.json(json);
  } catch (err) {
    console.error('requirements error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
