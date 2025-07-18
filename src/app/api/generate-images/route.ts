import { NextResponse } from 'next/server';

const FAL_API_URL = 'https://api.fal.ai/v1/images/generate';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log('Starting image generation for prompt:', prompt);

    const response = await fetch(FAL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: 'stable-diffusion-xl-v1-0',
        prompt,
        width: 1024,
        height: 1024,
        num_outputs: 4,
        safety_checker: true,
        seed: Math.floor(Math.random() * 1000000),
        scheduler: "euler-ancestral",
        num_inference_steps: 30,
        guidance_scale: 7.5,
      }),
    });

    const responseData = await response.json();
    console.log('Raw API Response:', responseData);

    if (!response.ok) {
      console.error('FAL API Error Response:', responseData);
      throw new Error(responseData.error?.message || 'API request failed');
    }

    if (!responseData?.images) {
      console.error('Invalid response format:', responseData);
      return NextResponse.json({ 
        error: 'Invalid response format', 
        details: 'The API response was not in the expected format',
        response: responseData
      }, { status: 500 });
    }

    const imageUrls = responseData.images;
    console.log('Generated image URLs:', imageUrls);

    return NextResponse.json({ images: imageUrls });

  } catch (error: any) {
    console.error('Detailed Error Information:', {
      message: error.message,
      response: error.response,
      stack: error.stack,
      error: error
    });

    return NextResponse.json({ 
      error: 'Failed to generate images', 
      details: error.message,
      errorObject: error
    }, { 
      status: 500 
    });
  }
} 