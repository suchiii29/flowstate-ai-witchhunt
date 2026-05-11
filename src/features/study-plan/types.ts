// src/features/study-plan/types.ts
// Shared type definitions for the AI Study Plan feature.

/** A single day's study task as returned by the AI. */
export interface StudyPlanItem {
  day: string;               // e.g. "Day 1 – Monday"
  subject: string;           // e.g. "Physics"
  task: string;              // e.g. "Newton's Laws – practice problems 1-20"
  estimatedMinutes: number;  // e.g. 90
  difficulty: "easy" | "medium" | "hard";
}

/** Form values collected from the user before generating the plan. */
export interface StudyPlanInput {
  courseGrade: string;   // e.g. "Grade 12 Science"
  subjects: string;      // comma-separated, e.g. "Physics, Chemistry, Math"
  examDate: string;      // ISO date string, e.g. "2025-06-15"
  hoursPerDay: number;   // 1–12
}

/** Client-side state wrapper that tracks loading / error / data. */
export interface StudyPlanState {
  status: "idle" | "loading" | "success" | "error";
  plan: StudyPlanItem[] | null;
  errorMessage: string | null;
}
