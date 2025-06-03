import { NextRequest, NextResponse } from 'next/server';
import Exa, { ResearchModel } from 'exa-js';
import { z } from 'zod';
import outdent from 'outdent';
import { generateProfilePrompt } from '../../../lib/promptUtils';

const exa = new Exa(process.env.EXA_API_KEY);

// Define Zod schema for a fun fact
const FunFactSchema = z.object({
  fact: z.string().describe('The interesting fun fact about the person'),
  source: z.string().optional().describe('The source of this fun fact (use just the title of the website, e.g. "LinkedIn", "Forbes", "TechCrunch")'),
  sourceUrl: z.string().optional().describe('The URL link to the source, if available')
});

// Define Zod schema for the collection of fun facts wrapped in an object
const FunFactsResponseSchema = z.object({
  funFacts: z.array(FunFactSchema)
    .describe('A collection of interesting and engaging fun facts about the person')
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate that we have selectedProfile
    const { selectedProfile } = body;
    
    if (!selectedProfile) {
      return NextResponse.json(
        { error: "selectedProfile is required" },
        { status: 400 }
      );
    }

    // Generate profile prompt using utility  
    const profilePrompt = generateProfilePrompt(selectedProfile);

    // Log length of profile prompt
    console.log(`Profile prompt character count: ${profilePrompt.length}`);

    const task = await exa.research.createTask({
      model: ResearchModel.exa_research,
      instructions: outdent`
        Research and find 3-5 interesting, unique, and lesser-known fun facts about this person. 

        Profile Information:
        ${profilePrompt}

        Guidelines:
        - Focus on niche and unique facts that most people wouldn't know
        - Look for surprising or unusual information about their life, background, hobbies, or lesser-known achievements
        - Avoid basic career information or well-known facts (those will be covered in other sections)
        - Use a casual, engaging tone suitable for social media
        - Each fact should be concise (one sentence that can be read on one line)
        - Include source information when possible
        - Avoid overly cringe or cheesy language, minimize exclamation points and cliché phrases
      `,
      output: {
        schema: {
          type: "object",
          required: ["funFacts"],
          properties: {
            funFacts: {
              type: "array",
              items: {
                type: "object",
                required: ["fact"],
                properties: {
                  fact: { type: "string" },
                  source: { type: "string" },
                  sourceUrl: { type: "string" }
                },
              }
            }
          },
          additionalProperties: false
        }
      }
    });

    const result = await exa.research.pollTask(task.id);

    // Validate the result with Zod
    const validatedResult = FunFactsResponseSchema.parse(result.data);

    return NextResponse.json(validatedResult);
  } catch (error) {
    console.error('Error generating fun facts:', error);
    return NextResponse.json(
      { error: `Failed to generate fun facts: ${error}` },
      { status: 500 }
    );
  }
}