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

    // TODO: Try to use name/headline to get more relevant results
    // Maybe use neural search instead of keyword search

    const results = await exa.searchAndContents(searchQuery, {
      text: true,
      type: "keyword",
      numResults: 10,
    });

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to perform Wikipedia search | ${error}` },
      { status: 500 }
    );
  }
}