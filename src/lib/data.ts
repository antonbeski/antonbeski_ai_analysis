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

export const performanceHistory: PerformanceData[] = [
  { date: '2024-07-01', progress: 65 },
  { date: '2024-07-02', progress: 68 },
  { date: '2024-07-03', progress: 72 },
  { date: '2024-07-04', progress: 71 },
  { date: '2024-07-05', progress: 75 },
  { date: '2024-07-06', progress: 80 },
  { date: '2024-07-07', progress: 82 },
];

export const accuracyData: AccuracyData[] = [
  { subject: 'Physics', correct: 75, incorrect: 25 },
  { subject: 'Chemistry', correct: 60, incorrect: 40 },
  { subject: 'Math', correct: 85, incorrect: 15 },
];

export const aiAnalysis = {
  strengths: 'Excellent problem-solving in Algebra and Kinematics. Consistently high accuracy in mathematical calculations.',
  weaknesses: 'Struggles with conceptual questions in Thermodynamics and Atomic Structure. Time management on Chemistry questions can be improved.',
  suggestedTopics: 'Focus on Heat Transfer (Conduction), Bohr\'s Model, and practice timed quizzes for Chemistry sections.',
};

export const practiceQuestions: PracticeQuestion[] = [
    {
        id: 'q1',
        question: "A projectile is thrown with an initial velocity of 20 m/s at an angle of 60° with the horizontal. What is the maximum height reached by the projectile? (g = 10 m/s²)",
        options: ["10 m", "15 m", "20 m", "25 m"],
        correctAnswer: "15 m",
        solution: "The formula for maximum height (H) in projectile motion is H = (v² * sin²(θ)) / (2 * g). Here, v = 20 m/s, θ = 60°, and g = 10 m/s². sin(60°) = √3 / 2. So, H = (20² * (√3/2)²) / (2 * 10) = (400 * 3/4) / 20 = 300 / 20 = 15 m."
    },
    {
        id: 'q2',
        question: "A block of mass 5 kg is placed on a rough horizontal surface. A force of 20 N is applied on the block. If the coefficient of friction is 0.2, find the acceleration of the block. (g = 10 m/s²)",
        visualAidUrl: "https://picsum.photos/seed/geometry1/500/500",
        options: ["1 m/s²", "2 m/s²", "3 m/s²", "0 m/s²"],
        correctAnswer: "2 m/s²",
        solution: "First, calculate the maximum static frictional force: f_s_max = μ_s * N = μ_s * mg = 0.2 * 5 * 10 = 10 N. The applied force (20 N) is greater than the frictional force (10 N), so the block will move. The net force is F_net = F_applied - f_k = 20 N - 10 N = 10 N. Now, use Newton's second law: F_net = ma => 10 = 5 * a => a = 2 m/s²."
    }
];
