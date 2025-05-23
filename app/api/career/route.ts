import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import outdent from 'outdent';

export const maxDuration = 60;

// Define Zod schema for a timeline event
const TimelineEventSchema = z.object({
  title: z.string().describe('The title or position/role of the career event'),
  dateRange: z.string().describe('The date range of the event (e.g., "2018-2020", "May 2019 - Present")'),
  description: z.string().describe('A brief description of the role, accomplishments, or significance')
});

// Define Zod schema for the career response
const CareerResponseSchema = z.object({
  skills: z.array(z.string()).describe('List of professional skills demonstrated by the person'),
  timeline: z.array(TimelineEventSchema)
    .describe('A chronological timeline of important career events')
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate that we have the required data
    const { contextPrompt } = body;
    
    if (!contextPrompt) {
      return NextResponse.json(
        { error: "contextPrompt is required" },
        { status: 400 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create prompt
    const prompt = outdent`
      ## Instructions
      - Extract professional information to create a career profile
      - First, identify 3-10 professional skills they have demonstrated in their career
      - Then, create a chronological timeline of their career with 3-7 key positions or roles
      - For skills, make them as specific and diverse as possible (1-2 words each)
      - For the timeline, include title/role, date range, and a brief description for each position
      - Maintain a professional tone throughout
      - Be specific and accurate, sticking to information found in the provided data
      - Format descriptions as short, concise statements (1-2 sentences maximum)
      - Arrange timeline events in reverse chronological order (most recent first)
      - Provide your response as a structured object with 'skills' and 'timeline' arrays

      ${contextPrompt}
    `;

    // Generate career information using OpenAI with structured output
    const response = await openai.responses.parse({
      model: "gpt-4.1-mini",
      input: prompt,
      text: {
        format: zodTextFormat(CareerResponseSchema, 'career')
      }
    });

    // Extract the typed career data from the response
    const careerResponse = response.output_parsed;

    if (!careerResponse || !careerResponse.skills || careerResponse.skills.length === 0 || !careerResponse.timeline || careerResponse.timeline.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate career information" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      skills: careerResponse.skills,
      timeline: careerResponse.timeline
    });
  } catch (error) {
    console.error('Error generating career information:', error);
    return NextResponse.json(
      { error: `Failed to generate career information: ${error}` },
      { status: 500 }
    );
  }
}