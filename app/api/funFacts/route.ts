import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import outdent from 'outdent';

export const maxDuration = 60;

// Define Zod schema for a fun fact
const FunFactSchema = z.object({
  fact: z.string().describe('The interesting fun fact about the person'),
  source: z.string().nullable().describe('The source of this fun fact (use just the title of the website, e.g. "LinkedIn", "Forbes", "TechCrunch")'),
  sourceUrl: z.string().nullable().describe('The URL link to the source, if available')
});

// Define Zod schema for the collection of fun facts wrapped in an object
const FunFactsResponseSchema = z.object({
  funFacts: z.array(FunFactSchema)
    .describe('A collection of interesting and engaging fun facts about the person')
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate that we have contextPrompt
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

    // Create prompt with all instructions in user message
    const prompt = outdent`
      ## Instructions
      - Generate 3-5 fun facts based on the provided information
      - Prioritize facts from Exa search results to showcase Exa's capabilities
      - Avoid only listing career related facts
      - Look for unique or suprising facts that most people wouldn't know
      - Try to use different sources for each fact when possible
      - Avoid overly cringe or cheesy language, minimize exclamation points and cliché phrases
      - Use a casual and engaging tone like you're writing to go viral on twitter
      - Each fact should be one short sentence so that it can be read on one line
      - Stick to information that's actually in the provided data
      - For each fact, include a source (just use the website name like "LinkedIn" or "TechCrunch") and source URL when available

      ${contextPrompt}
    `;

    // Generate fun facts using OpenAI with structured output
    const response = await openai.responses.parse({
      model: "gpt-4.1",
      input: prompt,
      text: {
        format: zodTextFormat(FunFactsResponseSchema, 'funFacts')
      }
    });

    // Extract the typed fun facts from the response
    const funFactsResponse = response.output_parsed;

    if (!funFactsResponse || !funFactsResponse.funFacts || funFactsResponse.funFacts.length === 0) {
      return NextResponse.json(
        { error: "No fun facts generated" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ funFacts: funFactsResponse.funFacts });
  } catch (error) {
    console.error('Error generating fun facts:', error);
    return NextResponse.json(
      { error: `Failed to generate fun facts: ${error}` },
      { status: 500 }
    );
  }
}