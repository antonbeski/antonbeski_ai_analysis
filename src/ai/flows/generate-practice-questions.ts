'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating practice questions from indexed PDFs.
 *
 * The flow takes a subject, chapter, topic, and subtopic as input, retrieves relevant text chunks from the indexed PDFs,
 * and uses them to generate practice questions. For multiple-choice questions, the model formulates plausible options.
 *
 * @interface GeneratePracticeQuestionsInput - Defines the input schema for the generatePracticeQuestions function.
 * @interface GeneratePracticeQuestionsOutput - Defines the output schema for the generatePracticeQuestions function.
 * @function generatePracticeQuestions - The main function that orchestrates the practice question generation process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePracticeQuestionsInputSchema = z.object({
  subject: z.string().describe('The subject of the practice questions (e.g., Physics, Chemistry, Math).'),
  chapter: z.string().describe('The chapter of the subject (e.g., Mechanics, Thermodynamics, Algebra).'),
  topic: z.string().describe('The specific topic within the chapter (e.g., Kinematics, Heat Transfer, Equations).'),
  subtopic: z.string().describe('The subtopic within the topic (e.g., Projectile Motion, Conduction, Quadratic Equations).'),
  questionType: z.enum(['multiple-choice', 'free-response']).describe('The type of question to generate.'),
  userHistoryAnalysis: z.string().optional().describe('Analysis of user history to identify specific areas to quiz the user on.'),
});

export type GeneratePracticeQuestionsInput = z.infer<typeof GeneratePracticeQuestionsInputSchema>;

const GeneratePracticeQuestionsOutputSchema = z.object({
  question: z.string().describe('The generated practice question.'),
  options: z.array(z.string()).optional().describe('The plausible options for a multiple-choice question.'),
});

export type GeneratePracticeQuestionsOutput = z.infer<typeof GeneratePracticeQuestionsOutputSchema>;

async function getRelevantTextChunks(input: GeneratePracticeQuestionsInput): Promise<string> {
  // TODO: Implement retrieval of relevant text chunks from indexed PDFs based on the input parameters.
  // This is a placeholder; replace with actual implementation.
  return `Relevant text chunks for ${input.subject}, ${input.chapter}, ${input.topic}, ${input.subtopic}.`;
}

const generatePracticeQuestionsPrompt = ai.definePrompt({
  name: 'generatePracticeQuestionsPrompt',
  input: {schema: GeneratePracticeQuestionsInputSchema},
  output: {schema: GeneratePracticeQuestionsOutputSchema},
  prompt: `You are an expert educator creating practice questions for JEE students.

  Based on the following context and user history analysis, generate a practice question.

  Context: {{{relevantTextChunks}}}
  User History Analysis: {{{userHistoryAnalysis}}}

  Subject: {{{subject}}}
  Chapter: {{{chapter}}}
  Topic: {{{topic}}}
  Subtopic: {{{subtopic}}}
  Question Type: {{{questionType}}}

  When creating multiple-choice questions, formulate plausible options.
  Ensure that options are related to the question and could be potential answers or common mistakes.

  If the question type is 'multiple-choice', the output should include both the question and an array of options.
  If the question type is 'free-response', the output should only include the question.

  Output the question and options as a JSON object.`,
});

const generatePracticeQuestionsFlow = ai.defineFlow(
  {
    name: 'generatePracticeQuestionsFlow',
    inputSchema: GeneratePracticeQuestionsInputSchema,
    outputSchema: GeneratePracticeQuestionsOutputSchema,
  },
  async input => {
    const relevantTextChunks = await getRelevantTextChunks(input);
    const {output} = await generatePracticeQuestionsPrompt({
      ...input,
      relevantTextChunks,
    });
    return output!;
  }
);

export async function generatePracticeQuestions(input: GeneratePracticeQuestionsInput): Promise<GeneratePracticeQuestionsOutput> {
  return generatePracticeQuestionsFlow(input);
}
