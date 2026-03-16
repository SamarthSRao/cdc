import { NextResponse } from 'next/server';

export async function GET() {
  // Spotify route handler
  return NextResponse.json({ message: 'Spotify route' });
}
