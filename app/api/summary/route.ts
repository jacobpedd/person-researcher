import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import outdent from "outdent";

export const maxDuration = 60;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    
    // Validate required fields
    const { contextPrompt } = body;
    
    if (!contextPrompt) {
      return NextResponse.json(
        { error: "contextPrompt is required" },
        { status: 400 }
      );
    }
    
    // Create a prompt for the LLM using outdent to maintain proper formatting
    const prompt = outdent`
      ## Instructions
      - Create a fun, brief Wikipedia-style profile summary based on the provided information
      - Limit you summary to one SHORT paragraph
      - Make this fun and engaging, like a Wikipedia intro but with personality
      - Focus on keeping the writing readable and engaging, not overloading on formality
      - Don't just walk through career history - that will be it's own section
      - Talk about non-work aspects of their background when possible
      - Include the most interesting facts about this person
      - Avoid just listing career history in order
      - Stick to information that's actually in the provided data
      - Write in third-person
      - Write as a single paragraph with no line breaks
      - Do not use HTML, Markdown, or any other formatting syntax

      ${contextPrompt}
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