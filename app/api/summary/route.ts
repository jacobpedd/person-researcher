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
      Create a fun, brief Wikipedia-style profile summary based on the following information:

      ${contextPrompt}

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