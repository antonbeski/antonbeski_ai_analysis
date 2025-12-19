# **App Name**: antonbeski

## Core Features:

- PDF Data Ingestion: Parse and index JEE PDFs (questions and solutions).
- RAG System: Implement a Retrieval-Augmented Generation (RAG) pipeline to retrieve relevant text chunks from the indexed PDFs and provide them as context to the LLM.
- Question Generation: Generate practice questions from indexed PDFs. For multiple-choice questions, prompt the model to formulate plausible options. Can select questions based on user history as analyzed with AI, serving as a tool to identify specific areas to quiz the user on.
- Solution Mode: Generate step-by-step answers or explain given solutions in detail using Gemma.
- Visual Aid Generation: Integrate Stable Diffusion to generate diagrams (e.g., circuit diagrams, geometric figures) from textual descriptions extracted from questions.
- Performance Analysis & Progress Tracking: Track user performance over time, identify strengths and weaknesses, and adapt practice quizzes to emphasize weak topics. Present insights in a dashboard with charts of accuracy by subject, daily progress, and time spent.
- User Interface: Next.js web app with a chat/quiz interface for answering questions and viewing explanations.
- Knowledge Normalization Layer: Implement a concept graph / topic taxonomy (Subject -> Chapter -> Topic -> Subtopic). Automatically tag every question. This enables true weakness detection, smart revision, and rank-level diagnostics. The AI serves as a tool that identifies specific areas to quiz the user on.
- Cognitive Error Analysis: Analyze the types of errors made: Conceptual error, Calculation error, Time pressure mistake, Guessing behavior, Option elimination failure. Add an Error Classifier AI Step.
- Time & Strategy Intelligence: Track time per question, time per subject, switching behavior, section-wise fatigue. Provide AI insights based on this data.
- Test Blueprint Engine: Explicitly encode JEE Main and Advanced Paper 1 & 2 patterns, including negative marking logic and partial marking logic. Implemented as a rule engine.
- Memory & Long-Term Adaptation: Implement daily logs, weekly summaries, and long-term trend detection. AI should answer questions like “Is my Mechanics actually improving or fluctuating?” and “Which topic is stuck despite practice?”.
- Question Canonicalization Layer: Duplicate & near-duplicate detection.  Hashing. Semantic similarity check. Canonical question ID
- Difficulty Calibration System: Calibrate difficulty based on historical accuracy, time taken, error frequency
- Confidence & Guess Detection: Detect blind guessing vs educated attempt
- Safety & Constraint Layer: Prevent burnout. Max daily difficulty increase. Mandatory revision injection. Rest-day suggestions

## Style Guidelines:

- Primary color: Black (#000000) to represent focus and sophistication.
- Background color: White (#FFFFFF) for a clean and distraction-free environment.
- Accent color: Gray (#808080) for subtle highlights and less important elements.
- Headline font: 'Poppins' sans-serif for headings, combined with 'PT Sans' sans-serif for body text.
- Use clear, educational icons in grayscale for different subjects and features.
- Clean and organized layout to minimize distractions, with a focus on readability.
- Subtle transitions and feedback animations in grayscale to enhance the user experience without being intrusive.