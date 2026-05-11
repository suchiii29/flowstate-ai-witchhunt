// src/features/reflection/types.ts
export type Challenge = 'Distractions' | 'Family duties' | 'Low energy' | 'Confusion about topics' | 'Other';

export interface ReflectionEntry {
  id?: string;
  date: string;
  studySummary: string;
  mood: number; // 1-5
  challenge: Challenge;
  aiFeedback?: string;
  timestamp: number;
}

export interface ReflectionInput {
  studySummary: string;
  mood: number;
  challenge: Challenge;
}
