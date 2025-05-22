import { NextRequest, NextResponse } from "next/server";
import Exa from "exa-js";

export const maxDuration = 60;

const exa = new Exa(process.env.EXA_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { profileUrl, profileName } = await req.json();

    if (!profileUrl) {
      return NextResponse.json(
        { error: "profileUrl is required" },
        { status: 400 }
      );
    }

    const result = await exa.findSimilarAndContents(profileUrl, {
      text: true,
      numResults: 15,
      includeDomains: ["linkedin.com", "wikipedia.org"],
      summary: {
        query:
          "Return the name and the headline of the profile owner. The headline should be the job title, company, and location as concisely as possible",
        schema: {
          $schema: "http://json-schema.org/draft-07/schema#",
          title: "Profile Summary",
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            headline: {
              type: "string",
            },
          },
          required: ["name", "headline"],
        },
      },
    });

    // Format the response for both LinkedIn and Wikipedia profiles
    const formattedResults = result.results
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

        // Determine source based on URL
        let source: "linkedin" | "wikipedia" = "linkedin";
        if (profile.url && profile.url.includes("wikipedia.org")) {
          source = "wikipedia";
        }

        return {
          id: profile.id,
          url: profile.url,
          name: name,
          headline: headline,
          text: profile.text,
          source: source,
        };
      })
      // Filter out results where name is missing or matches the original profile
      .filter((profile) => {
        if (!profile.name) return false;
        
        // Filter out profiles with the same name as the original
        if (profileName && profile.name.toLowerCase().trim() === profileName.toLowerCase().trim()) {
          return false;
        }
        
        return true;
      })
      // Take only the first 10 results
      .slice(0, 10);

    console.log(`Found ${formattedResults.length} similar profiles`);
    return NextResponse.json({ results: formattedResults });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to find similar profiles | ${error}` },
      { status: 500 }
    );
  }
}