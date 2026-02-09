'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting alternative layouts for a landing page.
 *
 * The flow takes in the current content of the landing page (texts and images), analyzes it based on text length/type, and image characteristics, and then
 * suggests alternative layouts.
 *
 * @exports suggestAlternativeLayouts - The main function to trigger the layout suggestion flow.
 * @exports SuggestAlternativeLayoutsInput - The input type for the suggestAlternativeLayouts function.
 * @exports SuggestAlternativeLayoutsOutput - The output type for the suggestAlternativeLayouts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternativeLayoutsInputSchema = z.object({
  texts: z
    .array(z.string())
    .describe('An array of text content from the landing page.'),
  images: z
    .array(z.string())
    .describe(
      'An array of image data URIs from the landing page, that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Properly formatted doc string
    ),
});
export type SuggestAlternativeLayoutsInput = z.infer<typeof SuggestAlternativeLayoutsInputSchema>;

const SuggestAlternativeLayoutsOutputSchema = z.object({
  layoutSuggestions: z
    .array(z.string())
    .describe('An array of suggested alternative layouts for the landing page.'),
});
export type SuggestAlternativeLayoutsOutput = z.infer<typeof SuggestAlternativeLayoutsOutputSchema>;

export async function suggestAlternativeLayouts(
  input: SuggestAlternativeLayoutsInput
): Promise<SuggestAlternativeLayoutsOutput> {
  return suggestAlternativeLayoutsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativeLayoutsPrompt',
  input: {schema: SuggestAlternativeLayoutsInputSchema},
  output: {schema: SuggestAlternativeLayoutsOutputSchema},
  prompt: `You are an expert landing page design assistant. Given the following text contents and image data URIs, suggest three alternative layouts for the landing page.

Text Contents:
{{#each texts}}
- {{{this}}}
{{/each}}

Images:
{{#each images}}
- {{media url=this}}
{{/each}}

Consider the length and type of the text, as well as the type and shape of the images when creating the layout suggestions. Be creative, but also practical.

Respond with an array of layout suggestions, where each suggestion is a short string describing the layout. For example: [\