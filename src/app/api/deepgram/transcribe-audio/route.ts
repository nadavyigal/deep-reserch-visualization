import { NextResponse } from "next/server";

// Get Deepgram API key from environment variables
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

export async function GET() {
  if (!DEEPGRAM_API_KEY) {
    console.error("DEEPGRAM_API_KEY is not configured in environment variables");
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  // Return just the API key for client-side use
  // This allows the client to establish a direct WebSocket connection
  return NextResponse.json({ apiKey: DEEPGRAM_API_KEY });
} 