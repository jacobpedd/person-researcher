// app/api/scrapewebsitesubpages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Exa from "exa-js";

export const maxDuration = 60;

const exa = new Exa(process.env.EXA_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { websiteurl } = await req.json();
    if (!websiteurl) {
      return NextResponse.json({ error: 'Website URL is required' }, { status: 400 });
    }

      const result = await exa.searchAndContents(
        websiteurl,
        {
          category: "company",
          type: "neural",
          text: true,
          numResults: 1,
          livecrawl: "always",
          subpages: 4,
          subpageTarget: ["about", "pricing", "faq", "blog"],
          includeDomains: [websiteurl]
        }
      )

    return NextResponse.json({ results: result.results });
  } catch (error) {
    return NextResponse.json({ error: `Failed to perform search | ${error}` }, { status: 500 });
  }
}