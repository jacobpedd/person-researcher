import { NextRequest, NextResponse } from "next/server";
import type { SearchResponse } from "exa-js";

export const maxDuration = 60;

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
    
    // For now, just return success with the validated input
    return NextResponse.json({ 
      success: true,
      message: "Input validated successfully"
    });
    
  } catch (error) {
    console.error("Error processing summary request:", error);
    return NextResponse.json(
      { error: `Failed to process summary request: ${error}` },
      { status: 500 }
    );
  }
}