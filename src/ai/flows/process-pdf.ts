'use server';

/**
 * @fileOverview A flow to process and index uploaded PDF files.
 *
 * - processPdf - A function that handles PDF parsing, storage, and indexing.
 * - ProcessPdfInput - The input type for the processPdf function.
 * - ProcessPdfOutput - The return type for the processPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from '@/firebase';
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

async function extractPdfText(buffer: Uint8Array): Promise<string> {
    // pdfjs-dist is a large library, so we're importing it dynamically.
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const loadingTask = getDocument({ data: buffer });
    const pdf = await loadingTask.promise;
  
    let fullText = "";
  
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
  
      const pageText = content.items
        .map((item: any) => item.str)
        .join(" ");
  
      fullText += pageText + "\\n";
    }
  
    return fullText.trim();
}


const ProcessPdfInputSchema = z.object({
  fileName: z.string().describe('The name of the uploaded PDF file.'),
  fileContent: z.string().describe('The Base64 encoded content of the PDF file.'),
});
export type ProcessPdfInput = z.infer<typeof ProcessPdfInputSchema>;

const ProcessPdfOutputSchema = z.object({
  message: z.string().describe('A message indicating the result of the processing.'),
  textLength: z.number().describe('The length of the extracted text.'),
  downloadUrl: z.string().optional().describe('The public URL of the uploaded PDF.'),
  textContent: z.string().optional().describe('The extracted text from the PDF.'),
});
export type ProcessPdfOutput = z.infer<typeof ProcessPdfOutputSchema>;

export async function processPdf(input: ProcessPdfInput): Promise<ProcessPdfOutput> {
  return processPdfFlow(input);
}

const processPdfFlow = ai.defineFlow(
  {
    name: 'processPdfFlow',
    inputSchema: ProcessPdfInputSchema,
    outputSchema: ProcessPdfOutputSchema,
  },
  async (input) => {
    const { firestore, firebaseApp } = initializeFirebase();
    const storage = getStorage(firebaseApp);
    const pdfBuffer = Buffer.from(input.fileContent, 'base64');
    
    // This is a placeholder for a real user ID.
    // In a real app, you would get this from the authenticated user.
    const userId = 'admin-user';

    try {
      // 1. Upload PDF to Firebase Storage
      const storageRef = ref(storage, `uploads/${userId}/${input.fileName}`);
      const uploadResult = await uploadBytes(storageRef, pdfBuffer);
      const downloadUrl = await getDownloadURL(uploadResult.ref);

      // 2. Create a document in Firestore for the PDF
      const pdfsCollectionRef = collection(firestore, 'users', userId, 'pdfDocuments');
      const pdfDocRef = await addDoc(pdfsCollectionRef, {
          userId: userId,
          title: input.fileName,
          uploadDate: serverTimestamp(),
          fileSize: pdfBuffer.length,
          storagePath: uploadResult.ref.fullPath,
          downloadUrl: downloadUrl,
      });

      // 3. Parse PDF to extract text using pdfjs-dist
      const textContent = await extractPdfText(pdfBuffer);
      
      // 4. Store extracted text in a subcollection
      // This is a simplified approach. For large PDFs, you'd chunk the text.
      const contentCollectionRef = collection(pdfDocRef, 'content');
      await addDoc(contentCollectionRef, {
          textContent: textContent,
      });

      return {
        message: `Successfully uploaded and processed ${input.fileName}.`,
        textLength: textContent.length,
        downloadUrl: downloadUrl,
        textContent: textContent,
      };
    } catch (error: any) {
      console.error('Failed to process PDF:', error);
      throw new Error(`Failed to process the provided PDF file: ${error.message}`);
    }
  }
);
