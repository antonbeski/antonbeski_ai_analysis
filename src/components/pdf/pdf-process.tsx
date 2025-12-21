'use client';

import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FileText, Upload, Copy, Download, Trash2, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Set workerSrc to use the unpkg CDN. This is required by pdfjs-dist.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

export function PDFProcess() {
  const [extractedText, setExtractedText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file');
      return;
    }

    setIsProcessing(true);
    setError('');
    setFileName(file.name);
    setCopied(false);
    setExtractedText('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      // We now use the reliable pdfjs-dist library to extract text.
      const text = await extractTextFromPDF(arrayBuffer);
      
      if (!text.trim()) {
        setError('No text found in PDF. The PDF might contain only images or scanned content.');
      } else {
        setExtractedText(text);
      }
    } catch (err) {
      setError('Failed to extract text from PDF. The file might be corrupted or in an unsupported format.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };
  
  const preventDefaults = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Extracts text from a PDF using pdfjs-dist.
   * @param data The PDF file data as an ArrayBuffer.
   * @returns A promise that resolves with the extracted text.
   */
  const extractTextFromPDF = async (data: ArrayBuffer): Promise<string> => {
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // The items in textContent are structured, we need to extract 'str' property
        const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
        fullText += pageText + '\n\n';
    }
    return fullText.trim();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.pdf', '.txt');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setExtractedText('');
    setFileName('');
    setError('');
    setCopied(false);
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if(fileInput) {
        fileInput.value = '';
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold font-headline mb-2">
            PDF Text Extractor
          </h1>
          <p className="text-muted-foreground">
            Upload your PDF and instantly extract all text content
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
          <label
            htmlFor="pdf-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-12 cursor-pointer hover:border-primary hover:bg-accent transition-all"
            onDrop={handleDrop}
            onDragOver={preventDefaults}
            onDragEnter={preventDefaults}
            onDragLeave={preventDefaults}
          >
            <Upload className="w-16 h-16 text-muted-foreground mb-4" />
            <span className="text-lg font-semibold mb-2">
              Click to upload PDF
            </span>
            <span className="text-sm text-muted-foreground">
              or drag and drop your file here
            </span>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {isProcessing && (
            <div className="mt-6 text-center">
              <Loader2 className="inline-block animate-spin h-8 w-8 text-primary"/>
              <p className="mt-2 text-muted-foreground">Processing PDF...</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive">{error}</p>
            </div>
          )}
        </div>

        {/* Extracted Text Display */}
        {extractedText && (
          <div className="bg-card rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Extracted Text
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{fileName}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                >
                  {copied ? <Check className="mr-2" /> : <Copy className="mr-2" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  onClick={downloadText}
                  variant="secondary"
                  size="sm"
                >
                  <Download className="mr-2" />
                  Download
                </Button>
                <Button
                  onClick={clearAll}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            <div className="bg-background rounded-lg p-4 max-h-96 overflow-y-auto border">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {extractedText}
              </pre>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Character count: {extractedText.length} | Word count:{' '}
              {extractedText.split(/\s+/).filter(Boolean).length}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Simple and secure - all processing happens in your browser</p>
        </div>
      </div>
    </div>
  );
}
