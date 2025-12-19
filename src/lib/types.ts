export type Subject = {
  id: string;
  name: string;
  chapters: Chapter[];
};

export type Chapter = {
  id: string;
  name: string;
  topics: Topic[];
};

export type Topic = {
  id: string;
  name: string;
  subtopics: Subtopic[];
};

export type Subtopic = {
  id: string;
  name: string;
};

export type PerformanceData = {
  date: string;
  progress: number;
};

export type AccuracyData = {
  subject: string;
  correct: number;
  incorrect: number;
};

export type PracticeQuestion = {
  id: string;
  question: string;
  visualAidUrl?: string;
  options?: string[];
  correctAnswer: string;
  solution: string;
  topicId: string;
};
