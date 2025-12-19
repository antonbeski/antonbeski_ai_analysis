'use client';

import { useState } from 'react';
import { QuizStart } from '@/components/practice/quiz-start';
import { QuizSession } from '@/components/practice/quiz-session';

type QuizState = 'not_started' | 'in_progress' | 'finished';

export default function PracticePage() {
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

  return (
    <div className="flex-1">
      {quizState === 'not_started' && <QuizStart onStart={handleStartQuiz} />}
      {quizState === 'in_progress' && currentTopic && <QuizSession topicId={currentTopic} onFinish={handleFinishQuiz} />}
      {quizState === 'finished' && (
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
      )}
    </div>
  );
}
