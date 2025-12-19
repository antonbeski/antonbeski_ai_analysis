import type { Subject, PerformanceData, AccuracyData, PracticeQuestion } from '@/lib/types';

export const subjects: Subject[] = [
  {
    id: 'physics',
    name: 'Physics',
    chapters: [
      {
        id: 'mechanics',
        name: 'Mechanics',
        topics: [
          { id: 'kinematics', name: 'Kinematics', subtopics: [{ id: 'projectile-motion', name: 'Projectile Motion' }] },
          { id: 'dynamics', name: 'Dynamics', subtopics: [{ id: 'newtons-laws', name: "Newton's Laws" }] },
        ],
      },
      {
        id: 'thermodynamics',
        name: 'Thermodynamics',
        topics: [
            { id: 'heat-transfer', name: 'Heat Transfer', subtopics: [{ id: 'conduction', name: 'Conduction' }] }
        ],
      },
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    chapters: [
      {
        id: 'physical-chemistry',
        name: 'Physical Chemistry',
        topics: [
            { id: 'atomic-structure', name: 'Atomic Structure', subtopics: [{ id: 'bohr-model', name: "Bohr's Model" }] }
        ],
      },
    ],
  },
  {
    id: 'math',
    name: 'Mathematics',
    chapters: [
      {
        id: 'algebra',
        name: 'Algebra',
        topics: [
            { id: 'quadratic-equations', name: 'Quadratic Equations', subtopics: [{ id: 'nature-of-roots', name: 'Nature of Roots' }] }
        ],
      },
    ],
  },
];

export const performanceHistory: PerformanceData[] = [];

export const accuracyData: AccuracyData[] = [];

export const aiAnalysis = {
  strengths: '',
  weaknesses: '',
  suggestedTopics: '',
};

export const practiceQuestions: PracticeQuestion[] = [];
