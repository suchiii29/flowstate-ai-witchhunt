// src/features/study-plan/studyPlanService.ts
// Handles prompt construction, Groq API call, response parsing, and
// localStorage persistence for the AI Study Plan feature.
// To switch AI provider: update GROQ_BASE_URL and GROQ_MODEL below.

import type { StudyPlanInput, StudyPlanItem } from "./types";

// ── Provider config — change these two constants to swap LLM providers ──────
const GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL    = "llama-3.3-70b-versatile";
// ─────────────────────────────────────────────────────────────────────────────

const LS_KEY = "flowstate_study_plan";

// ── localStorage helpers ─────────────────────────────────────────────────────

/** Persist a generated plan (or null to clear) to localStorage. */
export function saveStudyPlan(plan: StudyPlanItem[] | null): void {
  try {
    if (plan === null) {
      localStorage.removeItem(LS_KEY);
    } else {
      localStorage.setItem(LS_KEY, JSON.stringify(plan));
    }
  } catch {
    // Storage may be unavailable in some environments — fail silently.
  }
}

/** Retrieve the last generated plan from localStorage, or null if none. */
export function loadStudyPlan(): StudyPlanItem[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Basic shape validation — must be a non-empty array with a 'day' field.
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].day) {
      return parsed as StudyPlanItem[];
    }
    return null;
  } catch {
    return null;
  }
}

// ── Prompt builder ────────────────────────────────────────────────────────────

/** Constructs the structured prompt that asks the model for valid JSON only. */
function buildPrompt(input: StudyPlanInput): string {
  const { courseGrade, subjects, examDate, hoursPerDay } = input;

  // Calculate days remaining so the model can tailor urgency.
  const daysLeft = Math.max(
    1,
    Math.ceil(
      (new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  // Minute budget the student has each day.
  const dailyMinutes = hoursPerDay * 60;

  return `You are a precise academic study planner.
Create a 7-day study plan for a student with these details:
- Course / Grade: ${courseGrade}
- Subjects to cover: ${subjects}
- Exam date: ${examDate} (${daysLeft} days away)
- Available study time per day: ${hoursPerDay} hours (${dailyMinutes} minutes)

Rules:
1. Return ONLY a valid JSON array — no explanation, no markdown, no code fences.
2. The array must contain exactly 7 objects, one per day.
3. Distribute subjects evenly across the 7 days.
4. Each object must match this exact shape:
   { "day": string, "subject": string, "task": string, "estimatedMinutes": number, "difficulty": "easy" | "medium" | "hard" }
5. estimatedMinutes for each day must not exceed ${dailyMinutes}.
6. Assign difficulty based on topic complexity: foundational = easy, application = medium, problem-solving / integration = hard.

Respond with the JSON array and nothing else.`;
}

// ── JSON extraction helper ────────────────────────────────────────────────────

/**
 * Pulls a JSON array out of an arbitrary string.
 * Handles cases where the model wraps output in prose or code fences.
 */
function extractJsonArray(raw: string): string | null {
  // Strip <think>…</think> blocks emitted by some reasoning models.
  const cleaned = raw.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  // Look for the first '[' … last ']' span.
  const start = cleaned.indexOf("[");
  const end   = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) return null;

  return cleaned.slice(start, end + 1);
}

// ── Main service function ─────────────────────────────────────────────────────

/**
 * Calls the Groq API with a structured prompt and returns a parsed
 * StudyPlanItem array.  Throws a descriptive Error on any failure so the
 * UI can surface it gracefully.
 */
export async function generateStudyPlan(
  input: StudyPlanInput
): Promise<StudyPlanItem[]> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "VITE_GROQ_API_KEY is not set. Add it to your .env file to use AI features."
    );
  }

  const response = await fetch(GROQ_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: buildPrompt(input) }],
      max_tokens: 1800,
      temperature: 0.4, // Lower temperature → more deterministic JSON output
    }),
  });

  if (!response.ok) {
    // Try to surface the provider's error message if available.
    const errBody = await response.json().catch(() => ({}));
    const detail  = (errBody as any)?.error?.message ?? `HTTP ${response.status}`;
    throw new Error(`Groq API error: ${detail}`);
  }

  const data = await response.json();
  const rawText: string = data?.choices?.[0]?.message?.content ?? "";

  const jsonString = extractJsonArray(rawText);
  if (!jsonString) {
    throw new Error("The AI returned an unexpected response. Please try again.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error("Could not parse the AI response as JSON. Please try again.");
  }

  // Shape validation — each item must have the required fields.
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("The AI returned an empty plan. Please try again.");
  }

  const validDifficulties = new Set(["easy", "medium", "hard"]);

  const plan: StudyPlanItem[] = (parsed as any[]).map((item, idx) => {
    if (
      typeof item.day              !== "string" ||
      typeof item.subject          !== "string" ||
      typeof item.task             !== "string" ||
      typeof item.estimatedMinutes !== "number" ||
      !validDifficulties.has(item.difficulty)
    ) {
      throw new Error(`Plan item at index ${idx} has an invalid shape.`);
    }
    return {
      day:              item.day,
      subject:          item.subject,
      task:             item.task,
      estimatedMinutes: Math.round(item.estimatedMinutes),
      difficulty:       item.difficulty as StudyPlanItem["difficulty"],
    };
  });

  return plan;
}
