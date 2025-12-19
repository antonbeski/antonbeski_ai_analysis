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
import { initializeFirebase } from '@/firebase';
import { collectionGroup, getDocs, query, limit } from 'firebase/firestore';


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
  const { firestore } = initializeFirebase();
  const userId = 'admin-user'; // Placeholder

  try {
    // Query the 'content' subcollection across all user documents for simplicity.
    // In a real app, you'd likely target a specific user's documents.
    const contentQuery = query(collectionGroup(firestore, 'content'), limit(1));
    const querySnapshot = await getDocs(contentQuery);
    
    if (querySnapshot.empty) {
      return "No indexed PDF content found to generate questions from.";
    }

    // Combine text from all found content documents.
    // A real implementation would be more sophisticated, selecting chunks based on topic.
    const allText = querySnapshot.docs.map(doc => doc.data().textContent).join('\n\n');
    
    // For this example, we'll just return a snippet.
    const snippet = allText.substring(0, 4000); // Use a chunk of the text
    
    return snippet;

  } catch (error) {
    console.error("Error fetching text chunks from Firestore:", error);
    return "Error retrieving content from a PDF. Please ensure PDFs are uploaded and indexed.";
  }
}

const generatePracticeQuestionsPrompt = ai.definePrompt({
  name: 'generatePracticeQuestionsPrompt',
  input: {schema: z.object({
    subject: z.string(),
    chapter: z.string(),
    topic: z.string(),
    subtopic: z.string(),
    questionType: z.string(),
    userHistoryAnalysis: z.string().optional(),
    relevantTextChunks: z.string(),
  })},
  output: {schema: GeneratePracticeQuestionsOutputSchema},
  prompt: `You are an expert educator creating practice questions for JEE students.

  Based on the following context from an uploaded PDF, generate a practice question.

  Context: {{{relevantTextChunks}}}
  User History Analysis: {{{userHistoryAnalysis}}}

  Subject: {{{subject}}}
  Chapter: {{{chapter}}}
  Topic: {{{topic}}}
  Subtopic: {{{subtopic}}}
  Question Type: {{{questionType}}}

  When creating multiple-choice questions, formulate plausible options that are related to the question and represent common mistakes.
  The question should be challenging and relevant to the JEE exam level.

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
