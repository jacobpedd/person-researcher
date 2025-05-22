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

    const result = await exa.searchAndContents(searchQuery, {
      text: true,
      type: "keyword",
      numResults: 10,
      includeDomains: ["en.wikipedia.org"],
      summary: {
        query:
          "Return the name of the person from this Wikipedia article and a very brief one-sentence headline about them. The headline should include their occupation, notable work, and/or significance.",
        schema: {
          $schema: "http://json-schema.org/draft-07/schema#",
          title: "Wikipedia Person Summary",
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

    // Filter for Wikipedia article URLs and format the response
    const filteredResults = result.results
      .filter(
        (article: any) =>
          article.url && article.url.includes("wikipedia.org/wiki/")
      )
      .map((article: any) => {
        // Parse the summary to extract structured data
        let name = "";
        let headline = "";

        try {
          const summaryData = JSON.parse(article.summary);
          name = summaryData.name || "";
          headline = summaryData.headline || "";
        } catch (error) {
          console.error("Error parsing summary JSON:", error);
        }

        return {
          id: article.id,
          name: name,
          headline: headline,
          url: article.url,
          text: article.text,
          source: "wikipedia"
        };
      })
      // Filter out results where name or headline is missing
      .filter((article) => article.name && article.headline);

    console.log(`Filtered to ${filteredResults.length} Wikipedia articles`);
    return NextResponse.json({ results: filteredResults });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to perform Wikipedia search | ${error}` },
      { status: 500 }
    );
  }
}