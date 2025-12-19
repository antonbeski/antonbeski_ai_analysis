'use server';

/**
 * @fileOverview This flow analyzes the type of errors a student makes, categorizing them into conceptual, calculation, time pressure, etc.
 *
 * - identifyConceptualErrors - Analyzes student errors and categorizes them.
 * - IdentifyConceptualErrorsInput - The input type for the identifyConceptualErrors function.
 * - IdentifyConceptualErrorsOutput - The return type for the identifyConceptualErrors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyConceptualErrorsInputSchema = z.object({
  question: z.string().describe('The question the student attempted to answer.'),
  studentAnswer: z.string().describe('The answer provided by the student.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  solution: z.string().describe('The solution to the question.'),
});
export type IdentifyConceptualErrorsInput = z.infer<typeof IdentifyConceptualErrorsInputSchema>;

const IdentifyConceptualErrorsOutputSchema = z.object({
  errorType: z
    .enum([
      'Conceptual error',
      'Calculation error',
      'Time pressure mistake',
      'Guessing behavior',
      'Option elimination failure',
      'Other',
    ])
    .describe('The type of error the student made.'),
  explanation: z.string().describe('An explanation of why the student made this type of error.'),
});
export type IdentifyConceptualErrorsOutput = z.infer<typeof IdentifyConceptualErrorsOutputSchema>;

export async function identifyConceptualErrors(
  input: IdentifyConceptualErrorsInput
): Promise<IdentifyConceptualErrorsOutput> {
  return identifyConceptualErrorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyConceptualErrorsPrompt',
  input: {schema: IdentifyConceptualErrorsInputSchema},
  output: {schema: IdentifyConceptualErrorsOutputSchema},
  prompt: `You are an AI assistant that analyzes student errors and categorizes them.

  Based on the question, the student's answer, the correct answer, and the solution, determine the type of error the student made.
  The possible error types are:
  - Conceptual error: The student does not understand the underlying concepts.
  - Calculation error: The student made a mistake in the calculations.
  - Time pressure mistake: The student ran out of time and made a mistake.
  - Guessing behavior: The student guessed the answer without understanding the question.
  - Option elimination failure: The student failed to eliminate incorrect options.
  - Other: The error does not fall into any of the above categories.

  Question: {{{question}}}
  Student's Answer: {{{studentAnswer}}}
  Correct Answer: {{{correctAnswer}}}
  Solution: {{{solution}}}

  Analyze the provided information and determine the most likely error type and provide a brief explanation.`,
});

const identifyConceptualErrorsFlow = ai.defineFlow(
  {
    name: 'identifyConceptualErrorsFlow',
    inputSchema: IdentifyConceptualErrorsInputSchema,
    outputSchema: IdentifyConceptualErrorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
