// src/hooks/use-speech.ts
import { useState, useCallback } from 'react';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Browser does not support speech synthesis.");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for better clarity

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
