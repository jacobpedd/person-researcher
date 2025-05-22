import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import outdent from "outdent";

export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { contextPrompt } = body;
    
    if (!contextPrompt) {
      return NextResponse.json(
        { error: "contextPrompt is required" },
        { status: 400 }
      );
    }
    
    const prompt = outdent`
      ## Instructions
      - Write a short positive affirmation-style praise paragraph based on the following context
      - Focus on calling out specific details referenced in the context
      - The tone should be warm and supportive without being overly cringy or cheesy
      - Write in the third person (talking ABOUT them, not TO them)
      - Keep it to one short paragraph
      - Do not use HTML, Markdown, or any other formatting syntax

      ${contextPrompt}
    `;

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: prompt
    });
    
    const praise = response.output_text;
    
    return NextResponse.json({ praise });
    
  } catch (error) {
    console.error("Error processing praise request:", error);
    return NextResponse.json(
      { error: `Failed to process praise request: ${error}` },
      { status: 500 }
    );
  }
}