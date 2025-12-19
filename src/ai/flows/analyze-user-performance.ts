'use server';

/**
 * @fileOverview A flow to analyze user performance and identify strengths and weaknesses.
 *
 * - analyzeUserPerformance - A function that analyzes user performance data.
 * - AnalyzeUserPerformanceInput - The input type for the analyzeUserPerformance function.
 * - AnalyzeUserPerformanceOutput - The return type for the analyzeUserPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserPerformanceInputSchema = z.object({
  performanceData: z
    .string()
    .describe(
      'A string containing user performance data, including question history, accuracy, time spent, and error types.'
    ),
  topicTaxonomy: z
    .string()
    .describe(
      'A string representing the topic taxonomy (Subject -> Chapter -> Topic -> Subtopic) used to categorize questions.'
    ),
});
export type AnalyzeUserPerformanceInput = z.infer<
  typeof AnalyzeUserPerformanceInputSchema
>;

const AnalyzeUserPerformanceOutputSchema = z.object({
  strengths: z
    .string()
    .describe('A summary of the user\'s strengths based on the performance data.'),
  weaknesses: z
    .string()
    .describe('A summary of the user\'s weaknesses based on the performance data.'),
  suggestedTopics: z
    .string()
    .describe(
      'A list of topics the user should focus on, based on their weaknesses.'
    ),
});
export type AnalyzeUserPerformanceOutput = z.infer<
  typeof AnalyzeUserPerformanceOutputSchema
>;

export async function analyzeUserPerformance(
  input: AnalyzeUserPerformanceInput
): Promise<AnalyzeUserPerformanceOutput> {
  return analyzeUserPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUserPerformancePrompt',
  input: {schema: AnalyzeUserPerformanceInputSchema},
  output: {schema: AnalyzeUserPerformanceOutputSchema},
  prompt: `You are an AI performance analyst. Analyze the user's performance data and topic taxonomy to identify strengths, weaknesses, and suggest topics for improvement.

Performance Data: {{{performanceData}}}
Topic Taxonomy: {{{topicTaxonomy}}}

Based on the data provided, identify the user's strengths, weaknesses, and suggest topics for improvement.

Strengths: Summarize the user's strengths.
Weaknesses: Summarize the user's weaknesses.
Suggested Topics: List topics the user should focus on to improve.

Format your output as a JSON object with 'strengths', 'weaknesses', and 'suggestedTopics' fields, where the fields are strings.`,
});

const analyzeUserPerformanceFlow = ai.defineFlow(
  {
    name: 'analyzeUserPerformanceFlow',
    inputSchema: AnalyzeUserPerformanceInputSchema,
    outputSchema: AnalyzeUserPerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
