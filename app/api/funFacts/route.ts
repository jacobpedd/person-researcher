import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import outdent from 'outdent';

export const maxDuration = 60;

// Define Zod schema for a fun fact
const FunFactSchema = z.object({
  fact: z.string().describe('The interesting fun fact about the person'),
  source: z.string().optional().describe('The source of this fun fact, if available')
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
    
    // Validate that we have a search query
    const { searchQuery, profileResult, exaResults } = body;
    
    if (!searchQuery) {
      return NextResponse.json(
        { error: "searchQuery is required" },
        { status: 400 }
      );
    }
    
    if (!exaResults) {
      return NextResponse.json(
        { error: "exaResults is required" },
        { status: 400 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Extract content from profile if available
    const name = profileResult?.name || searchQuery;
    const headline = profileResult?.headline || '';
    const source = profileResult?.source || '';
    const text = profileResult?.text || '';

    // Extract relevant information from exaResults
    const exaContent = exaResults.results.map((result: any) => {
      return {
        title: result.title || "",
        url: result.url,
        text: result.text || "",
        summary: result.summary || ""
      };
    });

    // Create prompt with all instructions in user message
    const prompt = outdent`
      ## Task
      Generate 5-7 engaging, interesting fun facts about ${name} based on the provided information. Focus on unique accomplishments, surprising background details, hobbies, quirky preferences, or lesser-known achievements. Include sources when available.

      ## Search Query
      ${searchQuery}

      ## Profile Information
      Name: ${name}
      Headline: ${headline}
      Source: ${source}
      Text: 
      ${text}

      ## Search Results
      ${JSON.stringify(exaContent, null, 2)}

      ## Guidelines
      - Make each fun fact short, specific, and engaging
      - Focus on what makes them unique or noteworthy
      - Include sources when possible (using format "Source: [source]")
      - Cover a variety of aspects about the person (work, personal life, achievements, etc.)
      - Avoid generic information that could apply to many people
      - Stick to information that's actually in the provided data
      - Generate exactly 5-7 fun facts, no more and no less
      
      ## Output Format
      Provide your response as a structured object with a 'funFacts' array containing fun facts. Each fun fact should have a 'fact' field and an optional 'source' field.
    `;

    // Generate fun facts using OpenAI with structured output
    const response = await openai.responses.parse({
      model: "gpt-4.1-mini",
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