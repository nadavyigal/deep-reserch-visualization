import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { flowchartTemplates } from '@/lib/flowchartTemplates';

// Define the response type
interface FlowchartResponse {
  title: string;
  templateId: string;
  templateCode: string;
  mermaidCode: string;
  templateName: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text, section } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const contentToVisualize = section && section !== 'Full Document' ? section : text;

    console.log('Content to visualize:', contentToVisualize.substring(0, 100) + '...');
    console.log('Available templates:', flowchartTemplates.map(t => t.id).join(', '));

    // Step 1: Generate Mermaid code from the text
    const mermaidPrompt = `
      Create a Mermaid flowchart diagram based on the following content:
      "${contentToVisualize.substring(0, 1500)}"
      
      Guidelines:
      1. Extract the key processes, steps, or phases described in the content
      2. Organize these into a logical flowchart structure with clear relationships
      3. Use appropriate Mermaid syntax for the flowchart
      4. Include 5-10 key nodes that represent the main steps or processes
      5. Use descriptive labels for each node and connection
      6. The flowchart should be readable and not too complex
      7. Use the TD (top-down) direction for the flowchart
      8. Use appropriate node shapes: [] for process, {} for decision, () for start/end
      
      Return ONLY the Mermaid code without any explanation or markdown formatting.
      Example format:
      flowchart TD
        A[Start] --> B[Process 1]
        B --> C{Decision}
        C -->|Yes| D[Process 2]
        C -->|No| E[Process 3]
        D --> F[End]
        E --> F
    `;

    const mermaidResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are an expert in creating Mermaid flowchart diagrams. Generate clear, concise Mermaid code that accurately represents the provided content." 
        },
        { role: "user", content: mermaidPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const mermaidCode = mermaidResponse.choices[0].message.content?.trim() || '';
    console.log('Generated Mermaid code:', mermaidCode);

    // Step 2: Determine the best template to use
    const templatePrompt = `
      Analyze the following content and determine which flowchart template would be most appropriate:
      "${contentToVisualize.substring(0, 1000)}"
      
      Available templates:
      ${flowchartTemplates.map(template => `- ${template.id}: ${template.name} - ${template.description}`).join('\n')}
      
      Return only the template ID that best matches the content (e.g., "simple-process", "data-flow", "decision-tree", etc.).
    `;

    const templateResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are an expert in business process analysis and visualization. Select the most appropriate flowchart template based on the content." 
        },
        { role: "user", content: templatePrompt }
      ],
      temperature: 0.3,
      max_tokens: 50
    });

    const selectedTemplateId = templateResponse.choices[0].message.content?.trim();
    console.log('Selected template ID:', selectedTemplateId);
    
    // Find the selected template or default to the first one
    const selectedTemplate = flowchartTemplates.find(t => t.id === selectedTemplateId) || flowchartTemplates[0];
    console.log('Using template:', selectedTemplate.name);

    // Step 3: Generate a title for the flowchart
    const titlePrompt = `
      Create a concise, descriptive title for a flowchart based on this content:
      "${contentToVisualize.substring(0, 500)}"
      
      The title should be brief (5-8 words) but clearly describe what the flowchart represents.
      Return only the title without any additional text or formatting.
    `;

    const titleResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You create concise, descriptive titles for business diagrams." },
        { role: "user", content: titlePrompt }
      ],
      temperature: 0.3,
      max_tokens: 50
    });

    const flowchartTitle = titleResponse.choices[0].message.content?.trim() || 'Process Flowchart';
    console.log('Flowchart title:', flowchartTitle);

    // Step 4: Create a modified template code that incorporates the Mermaid diagram
    const combinedTemplateCode = `
    function createFlowchart(container) {
      // Create a div for the Mermaid diagram
      const mermaidDiv = document.createElement('div');
      mermaidDiv.className = 'mermaid';
      mermaidDiv.setAttribute('data-processed', 'false');
      mermaidDiv.textContent = \`${mermaidCode}\`;
      
      // Create a title element
      const titleElement = document.createElement('h3');
      titleElement.className = 'flowchart-title';
      titleElement.textContent = '${flowchartTitle}';
      
      // Add elements to container
      container.appendChild(titleElement);
      container.appendChild(mermaidDiv);
      
      // Basic styling
      container.style.position = 'relative';
      container.style.height = '400px';
      container.style.width = '100%';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      
      titleElement.style.marginBottom = '20px';
      titleElement.style.fontSize = '18px';
      titleElement.style.fontWeight = 'bold';
      
      mermaidDiv.style.width = '100%';
      mermaidDiv.style.height = '350px';
      mermaidDiv.style.display = 'flex';
      mermaidDiv.style.justifyContent = 'center';
      
      // Load Mermaid dynamically
      if (typeof window !== 'undefined') {
        // Check if Mermaid is already loaded
        if (!window.mermaid) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
          script.onload = () => {
            window.mermaid.initialize({ 
              startOnLoad: true,
              theme: 'default',
              securityLevel: 'loose',
              flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
              }
            });
            window.mermaid.run();
          };
          document.head.appendChild(script);
        } else {
          // If already loaded, just run it
          window.mermaid.run();
        }
      }
      
      // Add animation with anime.js
      anime({
        targets: [titleElement, mermaidDiv],
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(200),
        easing: 'easeOutQuad',
        duration: 800
      });
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = \`
        .flowchart-title {
          color: #333;
          text-align: center;
        }
        .mermaid {
          font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      \`;
      container.appendChild(style);
    }
    `;

    // Return the combined result
    const response: FlowchartResponse = {
      title: flowchartTitle,
      templateId: selectedTemplate.id,
      templateCode: combinedTemplateCode,
      mermaidCode: mermaidCode,
      templateName: selectedTemplate.name
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating flowchart:', error);
    return NextResponse.json(
      { error: 'Failed to generate flowchart', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 