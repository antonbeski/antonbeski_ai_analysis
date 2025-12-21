'use client';

import { useState } from 'react';
import { QuizStart } from '@/components/practice/quiz-start';
import { QuizSession } from '@/components/practice/quiz-session';
import { useAuthContext } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthDialog } from '@/components/auth-dialog';


type QuizState = 'not_started' | 'in_progress' | 'finished';

export default function PracticePage() {
  const { isAdmin, isLoading } = useAuthContext();
  const [quizState, setQuizState] = useState<QuizState>('not_started');
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!isAdmin) {
    return <AuthDialog />;
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
            </TabsList>
            <TabsContent value="practice">
                <QuizStart onStart={handleStartQuiz} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
