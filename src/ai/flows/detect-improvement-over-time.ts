'use server';

/**
 * @fileOverview Detects if a student's skills are improving over time and identifies topics that remain difficult despite practice.
 *
 * - detectImprovementOverTime - A function that analyzes the student's performance data to identify trends in skill improvement and persistent weaknesses.
 * - DetectImprovementOverTimeInput - The input type for the detectImprovementOverTime function.
 * - DetectImprovementOverTimeOutput - The return type for the detectImprovementOverTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectImprovementOverTimeInputSchema = z.object({
  studentId: z.string().describe('The unique identifier of the student.'),
  performanceData: z.array(
    z.object({
      topic: z.string().describe('The specific topic the student was tested on.'),
      date: z.string().describe('The date of the test (ISO format).'),
      score: z.number().describe('The student\'s score on the test (0-100).'),
      timeTaken: z.number().describe('Time taken to complete the test in seconds.'),
    })
  ).describe('An array of the student\'s performance data over time.'),
  topicTaxonomy: z.string().describe('A representation of the topic taxonomy. E.g. Subject -> Chapter -> Topic -> Subtopic.'),
});
export type DetectImprovementOverTimeInput = z.infer<typeof DetectImprovementOverTimeInputSchema>;

const DetectImprovementOverTimeOutputSchema = z.object({
  overallTrend: z.string().describe('A summary of the student\'s overall performance trend (e.g., improving, declining, stable).'),
  difficultTopics: z.array(
    z.object({
      topic: z.string().describe('The topic that remains difficult.'),
      averageScore: z.number().describe('The average score for the topic.'),
      attempts: z.number().describe('The number of attempts on the topic.'),
    })
  ).describe('An array of topics that the student struggles with despite practice.'),
  suggestedActions: z.string().describe('Suggestions for actions the student can take to improve.'),
});
export type DetectImprovementOverTimeOutput = z.infer<typeof DetectImprovementOverTimeOutputSchema>;

export async function detectImprovementOverTime(
  input: DetectImprovementOverTimeInput
): Promise<DetectImprovementOverTimeOutput> {
  return detectImprovementOverTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectImprovementOverTimePrompt',
  input: {schema: DetectImprovementOverTimeInputSchema},
  output: {schema: DetectImprovementOverTimeOutputSchema},
  prompt: `You are an AI performance analyst. Your job is to analyze student performance data and detect improvement over time, and help understand which topics remain difficult despite practice.

Analyze the following student performance data:
{{#each performanceData}}
- Topic: {{this.topic}}, Date: {{this.date}}, Score: {{this.score}}, Time Taken: {{this.timeTaken}} seconds
{{/each}}

Student ID: {{{studentId}}}
Topic Taxonomy: {{{topicTaxonomy}}}

Based on the data, provide the following:

1.  Overall Trend: A short summary of the student\'s overall performance trend (e.g., improving, declining, stable).
2.  Difficult Topics: A list of topics that the student struggles with despite practice, including the average score and number of attempts for each topic.
3.  Suggested Actions: Suggestions for actions the student can take to improve.

Output in JSON format:
{{outputSchema}}`,
});

const detectImprovementOverTimeFlow = ai.defineFlow(
  {
    name: 'detectImprovementOverTimeFlow',
    inputSchema: DetectImprovementOverTimeInputSchema,
    outputSchema: DetectImprovementOverTimeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
