// src/features/study-plan/StudyPlanForm.tsx
// Collects user inputs needed to generate a 7-day AI study plan.
// Styled with the same Tailwind / shadcn patterns used across the rest of the app.

import React, { useState } from "react";
import { Loader2, CalendarDays, BookOpen, Clock, GraduationCap, Sparkles } from "lucide-react";
import type { StudyPlanInput } from "./types";

interface StudyPlanFormProps {
  onSubmit: (input: StudyPlanInput) => void;
  isLoading: boolean;
}

export default function StudyPlanForm({ onSubmit, isLoading }: StudyPlanFormProps) {
  // Minimum exam date is tomorrow so the plan always covers future material.
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const [courseGrade, setCourseGrade] = useState("");
  const [subjects,    setSubjects]    = useState("");
  const [examDate,    setExamDate]    = useState("");
  const [hoursPerDay, setHoursPerDay] = useState<number>(3);
  const [touched,     setTouched]     = useState(false);

  const isValid =
    courseGrade.trim() !== "" &&
    subjects.trim()    !== "" &&
    examDate           !== "" &&
    hoursPerDay >= 1   &&
    hoursPerDay <= 12;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || isLoading) return;
    onSubmit({
      courseGrade: courseGrade.trim(),
      subjects:    subjects.trim(),
      examDate,
      hoursPerDay,
    });
  };

  // Shared label + input wrapper styles — mirrors AddTaskModal / AddLogModal patterns.
  const fieldClass =
    "flex flex-col gap-1.5";
  const labelClass =
    "text-xs font-medium text-muted-foreground flex items-center gap-1.5";
  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent " +
    "placeholder:text-muted-foreground/60 disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Course / Grade */}
      <div className={fieldClass}>
        <label htmlFor="sp-course" className={labelClass}>
          <GraduationCap className="w-3.5 h-3.5" />
          Course / Grade
        </label>
        <input
          id="sp-course"
          type="text"
          value={courseGrade}
          onChange={(e) => setCourseGrade(e.target.value)}
          placeholder="e.g. Grade 12 Science, JEE Mains, UPSC Prelims"
          className={inputClass}
          disabled={isLoading}
          maxLength={80}
        />
        {touched && courseGrade.trim() === "" && (
          <p className="text-xs text-red-500">Please enter your course or grade.</p>
        )}
      </div>

      {/* Subjects */}
      <div className={fieldClass}>
        <label htmlFor="sp-subjects" className={labelClass}>
          <BookOpen className="w-3.5 h-3.5" />
          Subjects <span className="font-normal">(comma-separated)</span>
        </label>
        <input
          id="sp-subjects"
          type="text"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          placeholder="e.g. Physics, Chemistry, Mathematics"
          className={inputClass}
          disabled={isLoading}
          maxLength={200}
        />
        {touched && subjects.trim() === "" && (
          <p className="text-xs text-red-500">Please list at least one subject.</p>
        )}
      </div>

      {/* Exam Date + Hours per Day — side by side on wider screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={fieldClass}>
          <label htmlFor="sp-exam-date" className={labelClass}>
            <CalendarDays className="w-3.5 h-3.5" />
            Exam / Target Date
          </label>
          <input
            id="sp-exam-date"
            type="date"
            value={examDate}
            min={minDate}
            onChange={(e) => setExamDate(e.target.value)}
            className={inputClass}
            disabled={isLoading}
          />
          {touched && examDate === "" && (
            <p className="text-xs text-red-500">Please pick your exam date.</p>
          )}
        </div>

        <div className={fieldClass}>
          <label htmlFor="sp-hours" className={labelClass}>
            <Clock className="w-3.5 h-3.5" />
            Study Hours Per Day
          </label>
          <input
            id="sp-hours"
            type="number"
            value={hoursPerDay}
            min={1}
            max={12}
            onChange={(e) => setHoursPerDay(Number(e.target.value))}
            className={inputClass}
            disabled={isLoading}
          />
          {touched && (hoursPerDay < 1 || hoursPerDay > 12) && (
            <p className="text-xs text-red-500">Enter a value between 1 and 12.</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
                   bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium 
                   rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating your plan…
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate 7-Day Study Plan
          </>
        )}
      </button>
    </form>
  );
}
