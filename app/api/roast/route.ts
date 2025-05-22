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
      - Create a comedic, playful roast based on the provided information
      - Open with a banger that sets the tone
      - Use the right blend of comedic insights and biting humor used on a roast 
      - Focus on details from the context that stand out as odd 
      - Avoid repeating the same joke or punchline
      - Write in the third person (talking ABOUT them, not TO them)
      - Proiritize humor that would go viral on Twitter
      - Don't be repetitive or just list career history
      - Don't be overly cringy or cheesy
      - Keep it to one short paragraph
      - Do not use HTML, Markdown, or any other formatting syntax

      ${contextPrompt}
    `;

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: prompt
    });
    
    const roast = response.output_text;
    
    return NextResponse.json({ roast });
    
  } catch (error) {
    console.error("Error processing roast request:", error);
    return NextResponse.json(
      { error: `Failed to process roast request: ${error}` },
      { status: 500 }
    );
  }
}