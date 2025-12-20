'use server';

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from '@/firebase';

async function extractPdfText(buffer: Uint8Array): Promise<string> {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const loadingTask = pdfjsLib.getDocument({ data: buffer });
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
