import { NextResponse } from 'next/server';

export async function GET() {
  // View count getter
  return NextResponse.json({ count: 0 });
}

export async function POST() {
  // View count incrementer
  return NextResponse.json({ success: true });
}
