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
      Create a comedic, playful roast based on the following information. Keep it lighthearted and fun - think comedy roast style, not mean-spirited.

      ${contextPrompt}

      ## Guidelines
      - Keep it playful and comedic, not cruel or personal
      - Focus on professional quirks, industry stereotypes, or funny observations
      - Use witty observations about their career, achievements, or public persona
      - Keep it short and punchy - maximum ONE paragraph
      - Think "Comedy Central Roast" style - funny but not offensive
      - Avoid anything that could be genuinely hurtful or inappropriate
      - Base jokes on the actual information provided, not made-up details
      - Use a confident, comedic tone
      - Write in second-person (talking TO them, not ABOUT them)

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