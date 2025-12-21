'use server';

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from '@/firebase';
import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';

// The worker is not used in Node.js, so we don't need to set workerSrc.
// We may need to import the worker for bundlers to be happy.
await import('pdfjs-dist/build/pdf.worker.mjs');

async function extractPdfText(buffer: Uint8Array): Promise<string> {
    const loadingTask = pdfjs.getDocument({ 
      data: buffer,
      // Explicitly disable the worker in the server environment
      worker: false 
    });
    const pdf = await loadingTask.promise;
  
    let fullText = "";
  
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
  
      const pageText = content.items
        .map((item: any) => item.str)
        .join(" ");
  
      fullText += pageText + "\n";
    }
  
    return fullText.trim();
}

export interface ProcessPdfInput {
  fileName: string;
  fileContent: string; // Base64 encoded content
}

export interface ProcessPdfOutput {
  message: string;
  textLength: number;
  downloadUrl?: string;
  textContent?: string;
}

export async function processPdf(input: ProcessPdfInput): Promise<ProcessPdfOutput> {
    const { firestore, firebaseApp } = initializeFirebase();
    const storage = getStorage(firebaseApp);
    const pdfBuffer = Buffer.from(input.fileContent, 'base64');
    
    const userId = 'admin-user'; // Placeholder

    try {
      const storageRef = ref(storage, `uploads/${userId}/${input.fileName}`);
      const uploadResult = await uploadBytes(storageRef, pdfBuffer);
      const downloadUrl = await getDownloadURL(uploadResult.ref);

      const pdfsCollectionRef = collection(firestore, 'users', userId, 'pdfDocuments');
      const pdfDocRef = await addDoc(pdfsCollectionRef, {
          userId: userId,
          title: input.fileName,
          uploadDate: serverTimestamp(),
          fileSize: pdfBuffer.length,
          storagePath: uploadResult.ref.fullPath,
          downloadUrl: downloadUrl,
      });

      const textContent = await extractPdfText(pdfBuffer);
      
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
