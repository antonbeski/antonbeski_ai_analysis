'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateVisualAid } from '@/ai/flows/generate-visual-aid';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';

export default function VisualAidPage() {
  const [description, setDescription] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description) return;
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const result = await generateVisualAid({ description });
      setGeneratedImage(result.imageDataUri);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">
        Visual Aid Generation
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Generate a Diagram</CardTitle>
          <CardDescription>
            Enter a textual description of a diagram (e.g., a circuit or a geometric figure) and the AI will generate it for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="e.g., A series circuit with a 12V battery, a 2 Ohm resistor, and a 4 Ohm resistor."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading || !description}>
            {isLoading ? 'Generating...' : 'Generate Image'}
          </Button>

          {error && (
             <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
          )}

          <div className="mt-6">
            {isLoading && (
              <div className='flex flex-col items-center justify-center'>
                <Skeleton className="h-[400px] w-[400px] rounded-lg" />
                <p className="text-muted-foreground mt-2">Generating image, this may take a moment...</p>
              </div>
            )}
            {generatedImage && (
              <div className="relative aspect-square w-full max-w-lg mx-auto">
                <Image
                  src={generatedImage}
                  alt="Generated visual aid"
                  fill
                  className="rounded-lg object-contain"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
