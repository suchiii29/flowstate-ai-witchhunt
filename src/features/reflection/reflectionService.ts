// src/features/reflection/reflectionService.ts
import type { ReflectionInput } from "./types";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function getAIReflectionFeedback(
  data: ReflectionInput,
  plannedTasks: string[] = []
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

  if (!apiKey) {
    throw new Error("API Key missing");
  }

  // Safety: Truncate input to avoid token overflow or malicious long inputs
  const studySummary = data.studySummary.slice(0, 500);

  const prompt = `
You are an empathetic study coach for Indian students from underserved backgrounds.
The student is reflecting on their day.

Today's Actual Study: ${studySummary}
Planned Tasks (if any): ${plannedTasks.join(", ") || "None mentioned"}
Mood (1-5, 5 being best): ${data.mood}
Biggest Challenge: ${data.challenge}

Instruction:
- Write a short, supportive, and practical feedback message.
- Address the challenge directly with a realistic tip.
- Be encouraging but grounded.
- Maximum 120 words.
- Response should be PLAIN TEXT only. Do not include JSON, tags, or headers.
`;

  const response = await fetch(GROQ_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get feedback from AI");
  }

  const result = await response.json();
  let feedback = result?.choices?.[0]?.message?.content ?? "Keep going, you're doing great!";
  
  // Clean deepseek logic if any
  feedback = feedback.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  return feedback;
}
