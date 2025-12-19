'use server';

/**
 * @fileOverview This file implements a Genkit flow for providing time and strategy insights to students.
 *
 * It analyzes the time spent on each question and subject to provide feedback on time management skills.
 *
 * @exported provideTimeStrategyInsights - An async function that takes user data and returns time management insights.
 * @exported TimeStrategyInsightsInput - The input type for the provideTimeStrategyInsights function.
 * @exported TimeStrategyInsightsOutput - The output type for the provideTimeStrategyInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TimeStrategyInsightsInputSchema = z.object({
  questionTimes: z
    .array(
      z.object({
        questionId: z.string(),
        timeSpentSeconds: z.number(),
        subject: z.string(),
      })
    )
    .describe('An array of question data including time spent and subject.'),
  switchingBehavior: z
    .string()
    .describe('Description of the user switching between sections.'),
  sectionFatigue: z.string().describe('Description of user fatigue per section.'),
});

export type TimeStrategyInsightsInput = z.infer<typeof TimeStrategyInsightsInputSchema>;

const TimeStrategyInsightsOutputSchema = z.object({
  insights: z.string().describe('Insights into the user time management strategy.'),
});

export type TimeStrategyInsightsOutput = z.infer<typeof TimeStrategyInsightsOutputSchema>;

export async function provideTimeStrategyInsights(
  input: TimeStrategyInsightsInput
): Promise<TimeStrategyInsightsOutput> {
  return provideTimeStrategyInsightsFlow(input);
}

const provideTimeStrategyInsightsPrompt = ai.definePrompt({
  name: 'provideTimeStrategyInsightsPrompt',
  input: {schema: TimeStrategyInsightsInputSchema},
  output: {schema: TimeStrategyInsightsOutputSchema},
  prompt: `You are an AI assistant designed to provide insights into a student's test-taking strategy.

  Analyze the following data to provide actionable advice to improve their time management skills.

  Question Times:
  {{#each questionTimes}}
  - Question ID: {{this.questionId}}, Time Spent: {{this.timeSpentSeconds}} seconds, Subject: {{this.subject}}
  {{/each}}

  Switching Behavior: {{{switchingBehavior}}}

  Section Fatigue: {{{sectionFatigue}}}

  Provide concise and clear insights that the student can use to improve their performance. Focus on time management and test-taking strategies.
  `,
});

const provideTimeStrategyInsightsFlow = ai.defineFlow(
  {
    name: 'provideTimeStrategyInsightsFlow',
    inputSchema: TimeStrategyInsightsInputSchema,
    outputSchema: TimeStrategyInsightsOutputSchema,
  },
  async input => {
    const {output} = await provideTimeStrategyInsightsPrompt(input);
    return output!;
  }
);
