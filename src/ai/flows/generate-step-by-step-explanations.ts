'use server';
/**
 * @fileOverview Generates step-by-step explanations for solutions.
 *
 * - generateStepByStepExplanation - A function that handles the generation of step-by-step explanations.
 * - GenerateStepByStepExplanationInput - The input type for the generateStepByStepExplanation function.
 * - GenerateStepByStepExplanationOutput - The return type for the generateStepByStepExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStepByStepExplanationInputSchema = z.object({
  question: z.string().describe('The question to generate an explanation for.'),
  solution: z.string().describe('The solution to explain step by step.'),
});
export type GenerateStepByStepExplanationInput = z.infer<
  typeof GenerateStepByStepExplanationInputSchema
>;

const GenerateStepByStepExplanationOutputSchema = z.object({
  explanation: z.string().describe('The step-by-step explanation of the solution.'),
});
export type GenerateStepByStepExplanationOutput = z.infer<
  typeof GenerateStepByStepExplanationOutputSchema
>;

export async function generateStepByStepExplanation(
  input: GenerateStepByStepExplanationInput
): Promise<GenerateStepByStepExplanationOutput> {
  return generateStepByStepExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStepByStepExplanationPrompt',
  input: {schema: GenerateStepByStepExplanationInputSchema},
  output: {schema: GenerateStepByStepExplanationOutputSchema},
  prompt: `You are an expert tutor who explains solutions step by step.\n\nQuestion: {{{question}}}\n\nSolution: {{{solution}}}\n\nGenerate a step-by-step explanation of the solution, making sure to explain the reasoning behind each step.`,
});

const generateStepByStepExplanationFlow = ai.defineFlow(
  {
    name: 'generateStepByStepExplanationFlow',
    inputSchema: GenerateStepByStepExplanationInputSchema,
    outputSchema: GenerateStepByStepExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
