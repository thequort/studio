// refine-product-description.ts
'use server';

/**
 * @fileOverview Refines product descriptions using GenAI to enhance engagement and highlight key features.
 *
 * - refineProductDescription - An async function that takes a raw product description as input and returns a refined version.
 * - RefineProductDescriptionInput - The input type for the refineProductDescription function.
 * - RefineProductDescriptionOutput - The return type for the refineProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineProductDescriptionInputSchema = z.object({
  rawDescription: z.string().describe('The raw, unrefined product description.'),
});
export type RefineProductDescriptionInput = z.infer<typeof RefineProductDescriptionInputSchema>;

const RefineProductDescriptionOutputSchema = z.object({
  refinedDescription: z.string().describe('The refined product description.'),
});
export type RefineProductDescriptionOutput = z.infer<typeof RefineProductDescriptionOutputSchema>;

export async function refineProductDescription(input: RefineProductDescriptionInput): Promise<RefineProductDescriptionOutput> {
  return refineProductDescriptionFlow(input);
}

const refineProductDescriptionPrompt = ai.definePrompt({
  name: 'refineProductDescriptionPrompt',
  input: {schema: RefineProductDescriptionInputSchema},
  output: {schema: RefineProductDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating engaging product descriptions for collectibles, memorabilia, clothing, and bags.

  Your goal is to refine the provided product description to make it more appealing to potential buyers, highlighting key features and adding an engaging narrative.

  Here is the raw product description:
  {{rawDescription}}

  Refine this description to be more engaging and highlight its key features, while maintaining accuracy.`,
});

const refineProductDescriptionFlow = ai.defineFlow(
  {
    name: 'refineProductDescriptionFlow',
    inputSchema: RefineProductDescriptionInputSchema,
    outputSchema: RefineProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await refineProductDescriptionPrompt(input);
    return output!;
  }
);
