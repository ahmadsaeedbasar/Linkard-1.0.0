'use server';

/**
 * @fileOverview A tagline generator AI agent.
 *
 * - generateTagline - A function that handles the tagline generation process.
 * - GenerateTaglineInput - The input type for the generateTagline function.
 * - GenerateTaglineOutput - The return type for the generateTagline function.
 */

import {ai} from '@/app/ai/genkit';
import {z} from 'genkit';

const GenerateTaglineInputSchema = z.object({
  aboutMe: z
    .string()
    .describe('The about me section of the freelancer profile.'),
});
export type GenerateTaglineInput = z.infer<typeof GenerateTaglineInputSchema>;

const GenerateTaglineOutputSchema = z.object({
  tagline: z.string().describe('The generated tagline for the visiting card.'),
});
export type GenerateTaglineOutput = z.infer<typeof GenerateTaglineOutputSchema>;

export async function generateTagline(input: GenerateTaglineInput): Promise<GenerateTaglineOutput> {
  return generateTaglineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTaglinePrompt',
  input: {schema: GenerateTaglineInputSchema},
  output: {schema: GenerateTaglineOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in creating taglines.

You will use the following information to generate a tagline for the freelancer's visiting card.

About Me: {{{aboutMe}}}

Generate a single tagline that is concise, memorable, and relevant to the freelancer's expertise and experience. The tagline should be no more than 10 words.`,
});

const generateTaglineFlow = ai.defineFlow(
  {
    name: 'generateTaglineFlow',
    inputSchema: GenerateTaglineInputSchema,
    outputSchema: GenerateTaglineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
