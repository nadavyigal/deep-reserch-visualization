import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fallback animation code in case OpenAI fails
const getFallbackAnimation = (text: string) => {
  return `
  function createAnimation(anime, container) {
    // Create a container for our animation that respects boundaries
    const animationWrapper = document.createElement('div');
    animationWrapper.style.position = 'relative';
    animationWrapper.style.width = '100%';
    animationWrapper.style.height = '100%';
    animationWrapper.style.display = 'flex';
    animationWrapper.style.flexDirection = 'column';
    animationWrapper.style.alignItems = 'center';
    animationWrapper.style.justifyContent = 'center';
    animationWrapper.style.overflow = 'hidden'; // Ensure content stays within bounds
    container.appendChild(animationWrapper);
    
    // Create a title element
    const title = document.createElement('h3');
    title.textContent = 'Animation';
    title.style.cssText = 'margin-bottom: 20px; color: #3498db; font-size: 24px; text-align: center;';
    animationWrapper.appendChild(title);
    
    // Create animated elements - contained within a smaller area
    const elementsContainer = document.createElement('div');
    elementsContainer.style.cssText = 'position: relative; width: 80%; height: 60%; display: flex; align-items: center; justify-content: center; flex-wrap: wrap;';
    animationWrapper.appendChild(elementsContainer);
    
    const elements = [];
    for (let i = 0; i < 5; i++) {
      const element = document.createElement('div');
      element.style.cssText = 'width: 40px; height: 40px; border-radius: 50%; background: #3498db; margin: 10px; opacity: 0;';
      elementsContainer.appendChild(element);
      elements.push(element);
    }
    
    // Create the animation with constrained movement
    const animation = anime.timeline({
      loop: true
    });
    
    // Add animation steps with constrained movement
    animation.add({
      targets: title,
      translateY: [-20, 0], // Reduced movement
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutElastic(1, .8)'
    }).add({
      targets: elements,
      translateX: [-30, 0], // Reduced movement
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: 'easeOutQuad'
    }).add({
      targets: elements,
      scale: [1, 1.2],
      delay: anime.stagger(100),
      duration: 600,
      easing: 'easeInOutQuad'
    }).add({
      targets: elements,
      translateX: [0, 30], // Reduced movement
      opacity: [1, 0],
      delay: anime.stagger(100),
      duration: 800,
      easing: 'easeOutQuad'
    });
    
    return animation;
  }
  `;
};

export async function POST(req: NextRequest) {
  try {
    const { text, sectionId } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }

    // Set a timeout for the OpenAI request
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('OpenAI request timed out')), 15000);
    });

    // Create the OpenAI request
    const openaiPromise = (async () => {
      // Prompt for OpenAI to generate animation code
      const prompt = `
        Create an anime.js animation that visualizes the following text content:
        "${text.substring(0, 500)}"
        
        Return ONLY valid JavaScript code that uses the anime.js library.
        The code should:
        1. Create HTML elements that represent key concepts from the content
        2. Apply appropriate animations to these elements
        3. Be wrapped in a NAMED function called 'createAnimation' that takes 'anime' and 'container' as parameters
        4. Append all created elements to the 'container' parameter (which is already provided)
        5. Return the animation instance at the end
        6. Use a clean, modern visual style with appropriate colors
        
        IMPORTANT REQUIREMENTS:
        - Do NOT redeclare the 'container' variable as it is already provided as a parameter
        - ALL animations MUST stay within the container boundaries - no overflow allowed
        - Set 'overflow: hidden' on wrapper elements to ensure content stays contained
        - Use relative positioning and percentages for sizing and positioning
        - Keep animations modest in size to prevent overflow
        - Ensure all elements remain visible within the container at all times
        
        Example format:
        
        function createAnimation(anime, container) {
          // Create a wrapper with overflow hidden to contain all animations
          const animationWrapper = document.createElement('div');
          animationWrapper.style.position = 'relative';
          animationWrapper.style.width = '100%';
          animationWrapper.style.height = '100%';
          animationWrapper.style.overflow = 'hidden'; // Prevent overflow
          container.appendChild(animationWrapper);
          
          // Create elements based on the content - use relative sizing
          const element = document.createElement('div');
          element.textContent = 'Key concept';
          element.style.cssText = 'position: absolute; width: 20%; height: 20%; background: #3498db;';
          animationWrapper.appendChild(element);
          
          // Create the animation with constrained movement
          const animation = anime({
            targets: element,
            translateY: ['20%', '0%'], // Use percentage-based transforms
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeOutElastic'
          });
          
          return animation;
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Use a faster model to reduce generation time
        messages: [
          { 
            role: "system", 
            content: "You are an expert in anime.js animations and data visualization. Create beautiful, functional animations that represent text content visually. IMPORTANT: Always use a named function called 'createAnimation' that takes 'anime' and 'container' as parameters. Do NOT redeclare the 'container' variable as it is already provided as a parameter." 
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
      animationCode = getFallbackAnimation(text);
    }
    
    // Clean up the code to remove markdown code blocks if present
    let cleanedCode = animationCode
      ? animationCode.replace(/```javascript|```js|```/g, '').trim()
      : getFallbackAnimation(text);
    
    // Ensure the code has a named function
    if (cleanedCode && !cleanedCode.includes('function createAnimation')) {
      // If the function is anonymous or incorrectly named, fix it
      cleanedCode = cleanedCode.replace(/function\s*\(anime,\s*container\)/g, 'function createAnimation(anime, container)');
    }
    
    return NextResponse.json({ 
      animationCode: cleanedCode,
      sectionId
    });
  } catch (error) {
    console.error('Error generating animation code:', error);
    // Return fallback animation instead of error
    return NextResponse.json({ 
      animationCode: getFallbackAnimation("Fallback animation"),
      sectionId: "fallback"
    });
  }
} 