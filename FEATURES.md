# New AI & Accessibility Features

This repository now includes several new features designed for students from underserved backgrounds.

## 1. AI Study Plan
- **How to use**: Go to the Dashboard and find the "AI Study Plan" section. Enter your current course, subjects, exam date, and daily study hours.
- **Functionality**: Generates a structured 7-day plan with specific tasks and difficulty levels using the Llama 3.3 model via Groq API.
- **Persistence**: Plans are saved in `localStorage` and persist through refreshes.

## 2. End-of-Day Reflection
- **How to use**: At the bottom of the Dashboard, fill in "Today's Reflection".
- **Functionality**:
    - Submit what you studied, your mood, and your biggest challenge (Distractions, Family duties, etc.).
    - Receive empathetic AI coaching feedback (max 120 words).
    - Tracks a **Reflection Streak** to encourage daily consistency.
- **Persistence**: Saved in Firebase Realtime Database under `reflections/${uid}`.

## 3. Accessibility & Optimization
### Low-Data Mode
- **Toggle**: Click the "Zap-Off" icon in the header.
- **Effect**: Hides all images/illustrations, removes gradients, and disables all animations to save bandwidth and improve performance on low-end devices.

### Language Support (English / Hindi)
- **Toggle**: Click the "EN" button in the header to switch to "HI" (Hindi).
- **Effect**: Translates all core UI labels, navigation menus, and dashboard headings.

### Read Aloud (Accessibility)
- **Toggle**: Click the "Volume" icon next to any study plan day.
- **Effect**: Uses the browser's SpeechSynthesis API to read your study tasks aloud.

---

## Technical Details
- **AI Model**: `llama-3.3-70b-versatile` via Groq.
- **API Key**: Required in `.env` as `VITE_GROQ_API_KEY`.
- **Database**: Firebase Realtime Database for reflection history and streaks.
- **I18n**: Managed through `SettingsContext` and the `translations.ts` dictionary.
