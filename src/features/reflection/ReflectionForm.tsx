// src/features/reflection/ReflectionForm.tsx
import React, { useState } from "react";
import { Send, Loader2, Sparkles, AlertCircle } from "lucide-react";
import type { ReflectionInput, Challenge } from "./types";
import { Button } from "@/components/ui/button";

const CHALLENGES: Challenge[] = [
  'Distractions', 
  'Family duties', 
  'Low energy', 
  'Confusion about topics', 
  'Other'
];

interface Props {
  onSubmit: (data: ReflectionInput) => Promise<void>;
  isLoading: boolean;
}

export default function ReflectionForm({ onSubmit, isLoading }: Props) {
  const [studySummary, setStudySummary] = useState("");
  const [mood, setMood] = useState(3);
  const [challenge, setChallenge] = useState<Challenge>('Other');
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studySummary.trim()) {
      setError("Please tell us what you studied today.");
      return;
    }
    setError("");
    await onSubmit({ studySummary, mood, challenge });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1.5 block text-muted-foreground">
          What did you actually study today?
        </label>
        <textarea
          value={studySummary}
          onChange={(e) => setStudySummary(e.target.value)}
          placeholder="I studied Physics optics and cleared doubts in Math..."
          className="w-full min-h-[100px] p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
        />
        {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block text-muted-foreground">
            How was your mood today?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  mood === m 
                    ? "bg-indigo-600 text-white scale-110" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block text-muted-foreground">
            Biggest challenge?
          </label>
          <select
            value={challenge}
            onChange={(e) => setChallenge(e.target.value as Challenge)}
            className="w-full p-2.5 rounded-xl border border-border bg-background outline-none text-sm focus:ring-2 focus:ring-indigo-500"
          >
            {CHALLENGES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl shadow-md"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Sparkles className="w-4 h-4 mr-2" />
        )}
        Submit Reflection
      </Button>
    </form>
  );
}
