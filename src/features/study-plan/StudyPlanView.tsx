// src/features/study-plan/StudyPlanView.tsx
// Renders the AI-generated 7-day study plan as a scrollable list of day cards.
// Color-codes difficulty and exposes "Regenerate" + "Clear Plan" actions.

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Trash2,
  Clock,
  BookOpen,
  Flame,
  Volume2,
} from "lucide-react";
import type { StudyPlanItem } from "./types";
import { useSpeech } from "@/hooks/use-speech";

interface StudyPlanViewProps {
  plan: StudyPlanItem[];
  onRegenerate: () => void;
  onClear: () => void;
  isLoading: boolean;
}

// Map difficulty → badge styling using the same color tokens as Dashboard.tsx
const DIFFICULTY_STYLES: Record<StudyPlanItem["difficulty"], string> = {
  easy:   "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  medium: "bg-amber-50  text-amber-700  dark:bg-amber-950  dark:text-amber-300  border-amber-200  dark:border-amber-800",
  hard:   "bg-red-50    text-red-700    dark:bg-red-950    dark:text-red-300    border-red-200    dark:border-red-800",
};

const DIFFICULTY_LABEL: Record<StudyPlanItem["difficulty"], string> = {
  easy:   "Easy",
  medium: "Medium",
  hard:   "Hard",
};

export default function StudyPlanView({
  plan,
  onRegenerate,
  onClear,
  isLoading,
}: StudyPlanViewProps) {
  const { speak, isSpeaking } = useSpeech();
  // Track which day cards are expanded — all collapsed by default.
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0]));

  const toggleDay = (idx: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  // Total study minutes across all 7 days for the summary header.
  const totalMinutes = plan.reduce((acc, item) => acc + item.estimatedMinutes, 0);
  const totalHours   = (totalMinutes / 60).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>{plan.length} days</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{totalHours}h total</span>
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>
              {plan.filter((d) => d.difficulty === "hard").length} hard sessions
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const fullText = plan.map(d => `${d.day}. Subject ${d.subject}. Task ${d.task}`).join('. ');
              speak(fullText);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-border transition ${isSpeaking ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-300' : 'hover:bg-muted'}`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            Read Full Plan
          </button>
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border 
                       border-border hover:bg-muted transition disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </button>
          <button
            onClick={onClear}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md 
                       text-red-600 border border-red-200 dark:border-red-800 
                       hover:bg-red-50 dark:hover:bg-red-950 transition disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Plan
          </button>
        </div>
      </div>

      {/* Day cards — scrollable column */}
      <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
        {plan.map((item, idx) => {
          const isOpen = expandedDays.has(idx);
          return (
            <div
              key={idx}
              className="rounded-xl border border-border bg-background overflow-hidden 
                         transition-shadow hover:shadow-sm"
            >
              {/* Card header — always visible, click to toggle body */}
              <button
                onClick={() => toggleDay(idx)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Day number bubble */}
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 
                                   text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>

                  <div className="min-w-0">
                    <span className="text-sm font-semibold truncate block">
                      {item.day}
                    </span>
                    <span className="text-xs text-muted-foreground truncate block">
                      {item.subject}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  {/* Difficulty badge */}
                  <span
                    className={`hidden sm:inline-flex text-[11px] font-medium px-2 py-0.5 
                                rounded-full border ${DIFFICULTY_STYLES[item.difficulty]}`}
                  >
                    {DIFFICULTY_LABEL[item.difficulty]}
                  </span>

                  {/* Duration */}
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.estimatedMinutes} min
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(`${item.day}. Subject ${item.subject}. Task ${item.task}`);
                    }}
                    className="p-1.5 rounded-md hover:bg-muted text-indigo-500 transition-colors"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expandable body */}
              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-border bg-muted/30">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm leading-relaxed text-foreground">
                      {item.task}
                    </p>
                    {/* Mobile difficulty badge */}
                    <span
                      className={`sm:hidden flex-shrink-0 text-[11px] font-medium px-2 py-0.5 
                                  rounded-full border ${DIFFICULTY_STYLES[item.difficulty]}`}
                    >
                      {DIFFICULTY_LABEL[item.difficulty]}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Estimated: {item.estimatedMinutes} minutes</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
