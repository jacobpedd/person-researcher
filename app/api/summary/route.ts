import { NextRequest, NextResponse } from "next/server";
import type { SearchResponse } from "exa-js";
import OpenAI from "openai";
import outdent from "outdent";

export const maxDuration = 60;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define the expected types for the request body
interface SummaryRequestBody {
  searchQuery: string;
  profileResult: {
    id: string;
    name: string;
    headline: string;
    url: string;
    text: string;
    source: "linkedin" | "wikipedia";
  };
  exaResults: SearchResponse<{
    text: true;
    type: string;
    numResults: number;
    summary: true;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    
    // Validate required fields
    const { searchQuery, profileResult, exaResults } = body as SummaryRequestBody;
    
    if (!searchQuery) {
      return NextResponse.json(
        { error: "searchQuery is required" },
        { status: 400 }
      );
    }
    
    if (!profileResult) {
      return NextResponse.json(
        { error: "profileResult is required" },
        { status: 400 }
      );
    }
    
    if (!exaResults) {
      return NextResponse.json(
        { error: "exaResults is required" },
        { status: 400 }
      );
    }
    
    // Further validation of profileResult
    const { id, name, headline, url, text, source } = profileResult;
    
    if (!id || !name || !headline || !url || !text || !source) {
      return NextResponse.json(
        { error: "profileResult is missing required fields" },
        { status: 400 }
      );
    }
    
    if (source !== "linkedin" && source !== "wikipedia") {
      return NextResponse.json(
        { error: "profileResult.source must be 'linkedin' or 'wikipedia'" },
        { status: 400 }
      );
    }
    
    // Extract relevant information from exaResults
    const exaContent = exaResults.results.map(result => {
      return {
        title: result.title || "",
        url: result.url,
        text: result.text || "",
        summary: result.summary || ""
      };
    });
    
    // Create a prompt for the LLM using outdent to maintain proper formatting
    const prompt = outdent`
      Create a fun, brief Wikipedia-style profile summary for ${name}, based on the following information:

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
      - Make this fun and engaging, like a Wikipedia intro but with personality
      - Keep it short and sweet - maximum ONE paragraph
      - Focus on keeping the writing readable and engaging, not overloading on formality
      - Don't just walk through career history - that will be it's own section
      - Talk about non-work aspects of their background when possible
      - Include the most interesting facts about this person
      - Focus on what makes them unique or noteworthy
      - Use a friendly, conversational tone
      - Stick to information that's actually in the provided data
      - Write in third-person

      ## Formatting Instructions
      - Format your response as plain text only
      - Write as a single paragraph with no line breaks
      - Do not use HTML, Markdown, or any other formatting syntax
      - No section headers or titles within the text
    `;

    // Generate the summary using OpenAI
    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: prompt
    });
    
    // Extract the generated summary
    const summary = response.output_text;
    
    return NextResponse.json({ summary });
    
  } catch (error) {
    console.error("Error processing summary request:", error);
    return NextResponse.json(
      { error: `Failed to process summary request: ${error}` },
      { status: 500 }
    );
  }
}