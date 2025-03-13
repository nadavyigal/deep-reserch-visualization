import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { getRandomTemplate } from '@/app/components/AnimationTemplates';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fallback animation code in case OpenAI fails
const getFallbackAnimation = (text: string) => {
  return getRandomTemplate();
};

export async function POST(req: NextRequest) {
  try {
    const { text, section } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Use section text if provided, otherwise use the full text
    // Limit to 1000 characters to avoid token limits
    const contentToAnimate = section && section !== 'Full Document' 
      ? section.substring(0, 1000) 
      : text.substring(0, 1000);

    // Set a timeout for the OpenAI request
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('OpenAI request timed out')), 15000);
    });

    // Create the OpenAI request
    const openaiPromise = (async () => {
      const prompt = `
        Create an anime.js animation that visually represents the following content:
        "${contentToAnimate}"
        
        Return ONLY valid JavaScript code that uses the anime.js library.
        The code should:
        1. Create HTML elements that represent key concepts from the content
        2. Apply appropriate animations to these elements
        3. Be wrapped in a NAMED function called 'createAnimation' that takes 'anime' and 'container' as parameters
        4. Append all created elements to the 'container' parameter
        5. Use a clean, modern visual style with appropriate colors and timing
        6. Return the animation instance at the end of the function
        7. Ensure all animations stay within the container boundaries
        8. Use relative positioning and percentages for sizing and positioning
        
        Example format:
        \`\`\`
        function createAnimation(anime, container) {
          // Create elements
          const element1 = document.createElement('div');
          element1.textContent = 'Example';
          element1.style.cssText = 'position: absolute; ...';
          container.appendChild(element1);
          
          // Create animation
          const animation = anime({
            targets: element1,
            translateY: [-50, 0],
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeOutElastic'
          });
          
          return animation;
        }
        \`\`\`
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Use a faster model to reduce generation time
        messages: [
          { 
            role: "system", 
            content: "You are an expert in anime.js animations and visual storytelling. Create beautiful, functional animations that represent text content visually. Always use named functions, not anonymous functions. Extract key concepts from the text and visualize them." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0].message.content;
    })();

    // Race the OpenAI request against the timeout
    let animationCode: string;
    try {
      animationCode = await Promise.race([openaiPromise, timeoutPromise]) as string;
    } catch (error) {
      console.warn('OpenAI request failed or timed out, using fallback animation:', error);
      return NextResponse.json({ animationCode: getFallbackAnimation(contentToAnimate) });
    }
    
    // Clean up the code to remove markdown code blocks if present
    let cleanedCode = animationCode
      ? animationCode.replace(/```javascript|```js|```/g, '').trim()
      : '';
    
    // Ensure the code has a named function
    if (cleanedCode && !cleanedCode.includes('function createAnimation')) {
      // If the function is anonymous or incorrectly named, fix it
      cleanedCode = cleanedCode.replace(/function\s*\(anime,\s*container\)/g, 'function createAnimation(anime, container)');
      cleanedCode = cleanedCode.replace(/function\s+([a-zA-Z0-9_$]+)\s*\(anime,\s*container\)/g, 'function createAnimation(anime, container)');
    }
    
    // Validate the animation code
    try {
      // Simple validation - check if it compiles
      new Function('anime', 'container', cleanedCode);
    } catch (error) {
      console.error('Invalid animation code generated, using fallback:', error);
      return NextResponse.json({ animationCode: getFallbackAnimation(contentToAnimate) });
    }
    
    return NextResponse.json({ animationCode: cleanedCode });
  } catch (error) {
    console.error('Error generating animation:', error);
    return NextResponse.json({ animationCode: getFallbackAnimation("Fallback animation") });
  }
}