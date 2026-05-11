// src/features/reflection/ReflectionView.tsx
import React from "react";
import { Quote, User, Bot, Sparkles, Trophy } from "lucide-react";
import type { ReflectionEntry } from "./types";

interface Props {
  reflection: ReflectionEntry;
  onNew: () => void;
  streak: number;
}

export default function ReflectionView({ reflection, onNew, streak }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-lg">
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reflection Streak</p>
            <p className="text-sm font-bold">{streak} Days</p>
          </div>
        </div>
        <button 
          onClick={onNew}
          className="text-xs text-indigo-600 hover:underline font-medium"
        >
          New Reflection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <User className="w-3 h-3" /> YOUR REFLECTION
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border relative">
            <Quote className="w-8 h-8 text-muted/20 absolute -top-2 -left-1" />
            <p className="text-sm italic relative z-10">{reflection.studySummary}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-background border border-border">
                Mood: {reflection.mood}/5
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-background border border-border">
                {reflection.challenge}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
            <Bot className="w-3 h-3" /> COACH FEEDBACK
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 relative group overflow-hidden">
            <Sparkles className="w-4 h-4 text-indigo-200 dark:text-indigo-800 absolute top-2 right-2 animate-pulse" />
            <p className="text-sm text-indigo-900 dark:text-indigo-100 leading-relaxed">
              {reflection.aiFeedback}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
