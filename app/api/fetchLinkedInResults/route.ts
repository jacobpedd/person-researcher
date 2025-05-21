import { NextRequest, NextResponse } from "next/server";
import Exa from "exa-js";

export const maxDuration = 60;

const exa = new Exa(process.env.EXA_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { searchQuery } = await req.json();

    if (!searchQuery) {
      return NextResponse.json(
        { error: "searchQuery is required" },
        { status: 400 }
      );
    }

    console.log(`Received search query: ${searchQuery}`);

    const result = await exa.searchAndContents(
      searchQuery,
      {
        text: true,
        type: "keyword",
        category: "linkedin profile",
        summary: {
          schema: {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "title": "LinkedIn Profile Summary",
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "description": "Full name of the LinkedIn profile owner"
              },
              "headline": {
                "type": "string",
                "description": "Current profession headline and location (one word) of the profile owner in as few words as possible"
              }
            },
            "required": ["name", "headline"]
          }
        },
      }
    );

    // Log search results for debugging
    console.log("Search results before filtering:", result.results.map((profile: any) => ({
      id: profile.id,
      url: profile.url,
      summary: profile.summary,
      text: profile.text ? profile.text.substring(0, 100) + "..." : ""
    })));

    // Filter for LinkedIn profile URLs and format the response
    const filteredResults = result.results
      .filter((profile: any) => profile.url && profile.url.includes('linkedin.com/in/'))
      .map((profile: any) => {
        // Parse the summary to extract structured data
        let name = "";
        let headline = "";
        
        try {
          const summaryData = JSON.parse(profile.summary);
          name = summaryData.name || "";
          headline = summaryData.headline || "";
        } catch (error) {
          console.error("Error parsing summary JSON:", error);
        }
        
        return {
          id: profile.id,
          url: profile.url,
          name: name,
          headline: headline,
          text: profile.text
        };
      });

    console.log(`Filtered to ${filteredResults.length} LinkedIn profiles`);
    return NextResponse.json({ results: filteredResults });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to perform search | ${error}` },
      { status: 500 }
    );
  }
}
