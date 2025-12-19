'use client';

import { useState } from 'react';
import Image from 'next/image';
import { practiceQuestions } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, ChevronRight, ChevronsRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface QuizSessionProps {
  topicId: string;
  onFinish: () => void;
}

export function QuizSession({ topicId, onFinish }: QuizSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const question = practiceQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const visualAid = PlaceHolderImages.find(img => img.imageHint.includes('diagram') || img.imageHint.includes('figure'));

  const handleSubmit = () => {
    if (selectedAnswer) {
      setIsAnswered(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      onFinish();
    }
  };

  return (
    <div className="p-4 md:p-8 flex justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {practiceQuestions.length}</p>
          <p className="text-lg">{question.question}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {question.visualAidUrl && visualAid && (
             <div className="my-4 relative h-64">
                <Image
                    src={visualAid.imageUrl}
                    alt={visualAid.description}
                    fill
                    className="rounded-md object-contain"
                    data-ai-hint={visualAid.imageHint}
                />
            </div>
          )}

          <RadioGroup 
            value={selectedAnswer ?? undefined}
            onValueChange={setSelectedAnswer} 
            disabled={isAnswered}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>

          {isAnswered && (
            <Alert variant={isCorrect ? "default" : "destructive"} className={isCorrect ? "border-green-500" : ""}>
              {isCorrect ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>{isCorrect ? 'Correct!' : 'Incorrect'}</AlertTitle>
              <AlertDescription>
                {isCorrect ? 'Great job!' : `The correct answer is ${question.correctAnswer}.`}
              </AlertDescription>
            </Alert>
          )}

          {isAnswered && (
            <Accordion type="single" collapsible>
              <AccordionItem value="solution">
                <AccordionTrigger>View Step-by-Step Solution</AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                    <p>{question.solution}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>
        <CardFooter>
          {!isAnswered ? (
            <Button onClick={handleSubmit} disabled={!selectedAnswer} className="ml-auto">
              Submit <ChevronRight/>
            </Button>
          ) : (
            <Button onClick={handleNext} className="ml-auto">
              {currentQuestionIndex < practiceQuestions.length - 1 ? 'Next Question' : 'Finish Session'}
              <ChevronsRight />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
