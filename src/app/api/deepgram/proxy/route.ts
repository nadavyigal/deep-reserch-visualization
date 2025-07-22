import { NextResponse } from 'next/server';

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

export async function POST(req: Request) {
  if (!DEEPGRAM_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const arrayBuffer = await req.arrayBuffer();
  if (!arrayBuffer.byteLength) {
    return NextResponse.json({ error: 'No audio data provided' }, { status: 400 });
  }

  const dgResp = await fetch('https://api.deepgram.com/v1/listen?punctuate=true', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${DEEPGRAM_API_KEY}`,
      'Content-Type': 'audio/webm'
    },
    body: Buffer.from(arrayBuffer)
  });

  if (!dgResp.ok) {
    const text = await dgResp.text();
    return NextResponse.json({ error: 'Deepgram request failed', details: text }, { status: 500 });
  }

  const data = await dgResp.json();
  return NextResponse.json(data);
}
