import { NextResponse } from 'next/server';

const FAL_KEY = process.env.FAL_KEY;

export async function POST(req: Request) {
  console.log('FAL API route called');
  
  if (!FAL_KEY) {
    console.error('FAL_KEY is not configured in environment variables');
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Log the request body for debugging
    const requestText = await req.text();
    console.log('Request body text:', requestText);
    
    // Parse the request body
    let requestData;
    try {
      requestData = JSON.parse(requestText);
      console.log('Parsed request data:', requestData);
    } catch (parseError) {
      console.error('Failed to parse request body as JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    const { prompt } = requestData;

    if (!prompt) {
      console.error('Missing prompt in request');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Log the key format (but mask most of it)
    const maskedKey = FAL_KEY.substring(0, 4) + '...' + FAL_KEY.substring(FAL_KEY.length - 4);
    console.log('Using FAL key format:', maskedKey);
    console.log('Sending request to FAL.ai with prompt:', prompt);

    // Using the direct model endpoint
    const response = await fetch('https://fal.run/fal-ai/flux-pro/v1.1-ultra/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${FAL_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        image_size: "1024x1024",
        num_inference_steps: 30,
        scheduler: "DDIM",
        guidance_scale: 7.5,
        negative_prompt: "",
        num_images: 1
      }),
    });

    // Log the response status and headers
    console.log('FAL API Response status:', response.status);
    console.log('FAL API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('FAL API error response text:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        console.error('FAL API error data:', errorData);
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        errorData = { raw: errorText };
      }
      
      return NextResponse.json(
        { 
          error: `API request failed with status ${response.status}`,
          details: errorData
        },
        { status: response.status }
      );
    }

    const responseText = await response.text();
    console.log('FAL API Response text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('FAL API Response data:', data);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid response from image service' },
        { status: 500 }
      );
    }

    // Return the image URL in the expected format
    const imageUrl = data.image?.url || data.images?.[0]?.url || data.images?.[0];
    
    if (!imageUrl) {
      console.error('No image URL found in response:', data);
      return NextResponse.json(
        { error: 'No image URL in response' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      images: [imageUrl]
    });

  } catch (error) {
    console.error('Error in FAL API route:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate image',
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
} 