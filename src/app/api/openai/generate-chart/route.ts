import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

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

    const prompt = `
      Create a data visualization for the following content:
      "${contentToVisualize}"
      
      Analyze the content and generate appropriate chart data and metadata.
      Choose the most suitable chart type (area, line, bar, or pie) based on the content.
      
      Return a JSON object with the following structure:
      {
        "chartType": "area|line|bar|pie",
        "chartTitle": "A descriptive title for the chart",
        "chartDescription": "A brief description or key insight from the data",
        "chartData": [
          // For area, line, or bar charts:
          { "name": "Category1", "value1": 100, "value2": 200, "label1": "Label for value1", "label2": "Label for value2" },
          { "name": "Category2", "value1": 150, "value2": 250, "label1": "Label for value1", "label2": "Label for value2" },
          // ... more data points
          
          // OR for pie charts:
          { "name": "Segment1", "value": 30 },
          { "name": "Segment2", "value": 70 },
          // ... more segments
        ]
      }
      
      Guidelines:
      1. For time-based data or growth trends, use line or area charts
      2. For comparing categories, use bar charts
      3. For showing proportions of a whole (like market share), use pie charts
      4. Limit to 5-7 data points for readability
      5. Extract actual numerical values from the content when available (like dollar amounts, percentages, years)
      6. If the content mentions specific platforms (YouTube, TikTok, Instagram, etc.), include them in the chart
      7. For market size data, use years as the x-axis when possible
      8. The chart title should clearly describe what the chart represents
      9. The chart description should highlight the most important insight or trend
      10. If the content mentions creator economy, influencer marketing, or similar topics, focus on visualizing those specific metrics
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are an expert in data visualization and analysis, specializing in creator economy, market trends, and business analytics. Create appropriate chart data based on text content, extracting real numbers and statistics when available." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const chartResponse = response.choices[0].message.content;
    
    // Parse the JSON response
    try {
      const chartData = JSON.parse(chartResponse || '{}');
      return NextResponse.json(chartData);
    } catch (parseError) {
      console.error('Error parsing chart data:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse chart data', details: parseError instanceof Error ? parseError.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating chart:', error);
    return NextResponse.json(
      { error: 'Failed to generate chart', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 