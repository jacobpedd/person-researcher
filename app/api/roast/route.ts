import { NextRequest, NextResponse } from "next/server";
import type { SearchResponse } from "exa-js";
import OpenAI from "openai";
import outdent from "outdent";

export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface RoastRequestBody {
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
    const body = await req.json();
    
    const { searchQuery, profileResult, exaResults } = body as RoastRequestBody;
    
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
    
    const exaContent = exaResults.results.map(result => {
      return {
        title: result.title || "",
        url: result.url,
        text: result.text || "",
        summary: result.summary || ""
      };
    });
    
    const prompt = outdent`
      Create a comedic, playful roast of ${name} based on the following information. Keep it lighthearted and fun - think comedy roast style, not mean-spirited.

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