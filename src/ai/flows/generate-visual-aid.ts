'use server';
/**
 * @fileOverview A flow to generate visual aids from a textual description.
 *
 * - generateVisualAid - A function that generates an image from a description.
 * - GenerateVisualAidInput - The input type for the generateVisualAid function.
 * - GenerateVisualAidOutput - The return type for the generateVisualAid function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVisualAidInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A textual description of the diagram to generate (e.g., circuit diagrams, geometric figures).'
    ),
});
export type GenerateVisualAidInput = z.infer<
  typeof GenerateVisualAidInputSchema
>;

const GenerateVisualAidOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe('The generated image as a data URI.'),
});
export type GenerateVisualAidOutput = z.infer<
  typeof GenerateVisualAidOutputSchema
>;

export async function generateVisualAid(
  input: GenerateVisualAidInput
): Promise<GenerateVisualAidOutput> {
  return generateVisualAidFlow(input);
}

const generateVisualAidFlow = ai.defineFlow(
  {
    name: 'generateVisualAidFlow',
    inputSchema: GenerateVisualAidInputSchema,
    outputSchema: GenerateVisualAidOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a clear, high-quality diagram for a physics or math problem. The diagram should be simple, with clean lines and easy-to-read labels. Focus on accuracy and clarity. Description: ${input.description}`,
    });

    if (!media.url) {
      throw new Error('Image generation failed.');
    }

    return {
      imageDataUri: media.url,
    };
  }
);
