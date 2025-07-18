import { NextResponse } from "next/server";

const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

export async function POST(req: Request) {
  console.log('Replicate API route called');
  
  if (!REPLICATE_API_KEY) {
    console.error('REPLICATE_API_KEY is not configured in environment variables');
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

    // Using Replicate's Stable Diffusion model
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${REPLICATE_API_KEY}`,
      },
      body: JSON.stringify({
        version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
        input: {
          prompt: prompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          scheduler: "K_EULER",
        },
      }),
    });

    // Log the response status and headers
    console.log('Replicate API Response status:', response.status);
    console.log('Replicate API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Replicate API error response text:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        console.error('Replicate API error data:', errorData);
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

    const data = await response.json();
    console.log('Replicate API initial response:', data);

    // Replicate returns a prediction ID that we need to poll for results
    const predictionId = data.id;
    if (!predictionId) {
      return NextResponse.json(
        { error: 'No prediction ID returned from Replicate' },
        { status: 500 }
      );
    }

    // Poll for the prediction result
    let prediction;
    let attempts = 0;
    const maxAttempts = 30; // Maximum number of polling attempts
    const pollInterval = 1000; // Polling interval in milliseconds

    while (attempts < maxAttempts) {
      attempts++;
      
      // Wait before polling
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      
      // Get the prediction status
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${REPLICATE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!pollResponse.ok) {
        console.error(`Failed to poll prediction: ${pollResponse.status}`);
        continue;
      }
      
      prediction = await pollResponse.json();
      console.log(`Polling attempt ${attempts}, status: ${prediction.status}`);
      
      if (prediction.status === 'succeeded') {
        break;
      }
      
      if (prediction.status === 'failed') {
        return NextResponse.json(
          { error: 'Image generation failed', details: prediction.error },
          { status: 500 }
        );
      }
    }

    if (!prediction || prediction.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Timed out waiting for image generation' },
        { status: 500 }
      );
    }

    // Get the output image URL
    const imageUrl = prediction.output?.[0];
    if (!imageUrl) {
      console.error('No image URL in prediction output:', prediction);
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
    console.error('Error in Replicate API route:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate image',
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}
