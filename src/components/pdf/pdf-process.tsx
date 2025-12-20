'use client';

import { useState } from 'react';
import { processPdf, ProcessPdfOutput } from '@/ai/flows/process-pdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PDFProcess() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProcessPdfOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve((reader.result as string).split(',')[1]);
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });

      const response = await processPdf({
        fileName: file.name,
        fileContent: base64Content,
      });

      setResult(response);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">
        PDF Processing
      </h2>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Upload PDF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="pdf">PDF File</Label>
              <Input id="pdf" type="file" onChange={handleFileChange} />
            </div>
            <Button onClick={handleSubmit} disabled={!file || isLoading}>
              {isLoading ? 'Processing...' : 'Process PDF'}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{result.message}</p>
              <p>Text Length: {result.textLength}</p>
              {result.downloadUrl && (
                <p>
                  <a
                    href={result.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Download PDF
                  </a>
                </p>
              )}
              {result.textContent && (
                <ScrollArea className="h-72 w-full rounded-md border p-4 mt-4">
                  <pre>{result.textContent}</pre>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
