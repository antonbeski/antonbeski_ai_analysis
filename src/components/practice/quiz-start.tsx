'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subjects } from "@/lib/data";
import type { Subject, Chapter, Topic } from "@/lib/types";
import { Lightbulb } from 'lucide-react';

interface QuizStartProps {
  onStart: (topicId: string) => void;
}

export function QuizStart({ onStart }: QuizStartProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleStart = () => {
    if (selectedTopic) {
      onStart(selectedTopic.id);
    }
  };

  return (
    <div className="flex justify-center items-center h-full p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <Lightbulb className="h-6 w-6" />
          </div>
          <CardTitle className="font-headline">Start a Practice Session</CardTitle>
          <CardDescription>Select a topic to begin your personalized quiz.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Select onValueChange={(value) => {
              setSelectedSubject(subjects.find(s => s.id === value) || null);
              setSelectedChapter(null);
              setSelectedTopic(null);
            }}>
              <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
              <SelectContent>
                {subjects.map(subject => <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Chapter</label>
            <Select
              disabled={!selectedSubject}
              onValueChange={(value) => {
                setSelectedChapter(selectedSubject?.chapters.find(c => c.id === value) || null);
                setSelectedTopic(null);
              }}
            >
              <SelectTrigger><SelectValue placeholder="Select a chapter" /></SelectTrigger>
              <SelectContent>
                {selectedSubject?.chapters.map(chapter => <SelectItem key={chapter.id} value={chapter.id}>{chapter.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Topic</label>
            <Select
              disabled={!selectedChapter}
              onValueChange={(value) => setSelectedTopic(selectedChapter?.topics.find(t => t.id === value) || null)}
            >
              <SelectTrigger><SelectValue placeholder="Select a topic" /></SelectTrigger>
              <SelectContent>
                {selectedChapter?.topics.map(topic => <SelectItem key={topic.id} value={topic.id}>{topic.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleStart} disabled={!selectedTopic} className="w-full">
            Start Practice
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
