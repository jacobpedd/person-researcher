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
      Create an uplifting, positive affirmation-style praise based on the following information. Focus on their strengths, achievements, and positive qualities.

      ${contextPrompt}

      ## Guidelines
      - Focus on genuine accomplishments and positive qualities
      - Highlight their professional achievements, skills, and contributions
      - Use an encouraging, warm, and supportive tone
      - Keep it authentic - base praise on actual information provided
      - Keep it short and impactful - maximum ONE paragraph
      - Think "motivational speaker" or "positive affirmation" style
      - Celebrate their unique strengths and what makes them special
      - Use inspiring and uplifting language
      - Write in second-person (talking TO them, not ABOUT them)
      - Make them feel genuinely appreciated and valued

      ## Formatting Instructions
      - Format your response as plain text only
      - Write as a single paragraph with no line breaks
      - Do not use HTML, Markdown, or any other formatting syntax
      - No section headers or titles within the text
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