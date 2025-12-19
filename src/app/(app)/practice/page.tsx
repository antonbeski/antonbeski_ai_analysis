'use client';

import { useState } from 'react';
import { QuizStart } from '@/components/practice/quiz-start';
import { QuizSession } from '@/components/practice/quiz-session';
import { useAuthContext } from '@/context/auth-context';
import { Loader2, UploadCloud, FileCheck, FileX } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { processPdf } from '@/ai/flows/process-pdf';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


type QuizState = 'not_started' | 'in_progress' | 'finished';

export default function PracticePage() {
  const { isAdmin, isLoading } = useAuthContext();
  const [quizState, setQuizState] = useState<QuizState>('not_started');
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleStartQuiz = (topicId: string) => {
    setCurrentTopic(topicId);
    setQuizState('in_progress');
  };
  
  const handleFinishQuiz = () => {
    setQuizState('finished');
  }

  const handleRestart = () => {
    setQuizState('not_started');
    setCurrentTopic(null);
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsProcessing(true);
      setResult(null);

      try {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const response = await processPdf({
              fileName: file.name,
              fileContent: buffer.toString('base64'),
          });

          setResult({ success: true, message: `Successfully processed ${file.name}. ${response.message}` });
      } catch (error: any) {
          setResult({ success: false, message: error.message || 'An unexpected error occurred during processing.' });
      } finally {
          setIsProcessing(false);
      }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className='text-muted-foreground'>This page is for admins only.</p>
      </div>
    );
  }

  if (quizState === 'in_progress' && currentTopic) {
    return (
        <div className="flex-1">
            <QuizSession topicId={currentTopic} onFinish={handleFinishQuiz} />
        </div>
    );
  }
  
  if (quizState === 'finished') {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <h2 className="text-2xl font-bold font-headline mb-2">Session Complete!</h2>
            <p className="text-muted-foreground mb-4">You have completed all the questions for this topic.</p>
            <button
              onClick={handleRestart}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
            >
              Practice Another Topic
            </button>
        </div>
      )
  }


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
            Practice Hub
        </h2>
        <Tabs defaultValue="practice" className="space-y-4">
            <TabsList>
                <TabsTrigger value="practice">Start Quiz</TabsTrigger>
                <TabsTrigger value="upload">Upload PDF</TabsTrigger>
            </TabsList>
            <TabsContent value="practice">
                <QuizStart onStart={handleStartQuiz} />
            </TabsContent>
            <TabsContent value="upload">
                <Card>
                    <CardHeader>
                        <CardTitle>PDF Data Ingestion</CardTitle>
                        <CardDescription>Parse and index JEE PDFs (questions and solutions).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div 
                            className="flex flex-col items-center justify-center text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg relative"
                        >
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                disabled={isProcessing}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                id="pdf-upload"
                            />
                             <label htmlFor="pdf-upload" className={`flex flex-col items-center justify-center ${isProcessing ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                {isProcessing ? (
                                    <Loader2 className="w-16 h-16 mb-4 animate-spin" />
                                ) : (
                                    <UploadCloud className="w-16 h-16 mb-4" />
                                )}
                                <p>{isProcessing ? 'Processing PDF...' : 'Click or drag & drop to upload'}</p>
                                <p className="text-xs mt-2">This feature is available only to the administrator.</p>
                             </label>
                        </div>

                        {result && (
                            <Alert variant={result.success ? 'default' : 'destructive'} className="mt-4">
                                {result.success ? <FileCheck className="h-4 w-4" /> : <FileX className="h-4 w-4" />}
                                <AlertTitle>{result.success ? 'Processing Complete' : 'Processing Failed'}</AlertTitle>
                                <AlertDescription>{result.message}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
