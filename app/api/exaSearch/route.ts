import { NextRequest, NextResponse } from "next/server";
import Exa from "exa-js";
import outdent from "outdent";

export const maxDuration = 60;

const exa = new Exa(process.env.EXA_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { searchQuery, selectedProfile } = await req.json();

    if (!searchQuery) {
      return NextResponse.json(
        { error: "searchQuery is required" },
        { status: 400 }
      );
    }

    if (!selectedProfile) {
      return NextResponse.json(
        { error: "selectedProfile is required" },
        { status: 400 }
      );
    }

    // Build search prompt based on profile source
    const searchPrompt = outdent`
      ${selectedProfile.name}
      ${selectedProfile.headline || ""}
      Here are some websites that contain information about the person in the above ${selectedProfile.source} profile: 
    `;

    const results = await exa.searchAndContents(searchPrompt, {
      text: true,
      type: "neural",
      numResults: 25,
    });

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to perform Wikipedia search | ${error}` },
      { status: 500 }
    );
  }
}