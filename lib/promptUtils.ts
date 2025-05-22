import type { SearchResponse } from "exa-js";
import type { ProfileResult } from "../components/PersonResearchHome";
import outdent from "outdent";

interface ContextPromptParams {
  searchQuery: string;
  profileResult: ProfileResult;
  exaResults: SearchResponse<{
    text: true;
    type: string;
    numResults: number;
  }>;
}

export function generateContextPrompt({ searchQuery, profileResult, exaResults }: ContextPromptParams): string {
  // Extract content from profile
  const { name, headline, url, text, source } = profileResult;

  // Extract relevant information from exaResults
  const exaContent = exaResults.results.map(result => ({
    title: result.title || "",
    url: result.url,
    text: result.text || "",
  }));

  return outdent`
    ## Search Query
    ${searchQuery}

    ## Profile Information
    Name: ${name}
    Headline: ${headline}
    Source: ${source}
    Text: 
    ${text}

    ## Exa Search Results
    **Note:** Only use result content that relates to the person in the above profile.
    ${exaContent.map(result => outdent`
      ### ${result.title}
      - Title: ${result.title}
      - URL: ${result.url}
      - Text Content: ${result.text}
    `).join('\n\n')}
  `;
}