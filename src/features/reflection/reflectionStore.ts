// src/features/reflection/reflectionStore.ts
import { db } from "@/firebase";
import { ref, push, set, get, child } from "firebase/database";
import type { ReflectionEntry } from "./types";

export async function saveReflection(uid: string, entry: ReflectionEntry) {
  const reflectionsRef = ref(db, `reflections/${uid}`);
  const newRef = push(reflectionsRef);
  
  const finalEntry = {
    ...entry,
    id: newRef.key,
    timestamp: Date.now()
  };

  await set(newRef, finalEntry);
  await updateReflectionStreak(uid);
  
  return finalEntry;
}

async function updateReflectionStreak(uid: string) {
  const profileRef = ref(db, `users/${uid}/profile`);
  const snapshot = await get(child(ref(db), `users/${uid}/profile/reflectionStreak`));
  
  let streak = snapshot.val() || 0;
  
  // Get last reflection date
  const reflectionsRef = ref(db, `reflections/${uid}`);
  // In a real app we'd query by timestamp, for simplicity we'll just increment
  // but a robust version would check if the last reflection was yesterday.
  
  await set(child(profileRef, 'reflectionStreak'), streak + 1);
  await set(child(profileRef, 'lastReflectionAt'), Date.now());
}

export async function getLatestReflection(uid: string): Promise<ReflectionEntry | null> {
  const reflectionsRef = ref(db, `reflections/${uid}`);
  // Firebase Realtime DB doesn't have a great "limit 1" from web SDK without query
  // For this prototype, we'll just fetch and pick the last one.
  const snapshot = await get(reflectionsRef);
  if (!snapshot.exists()) return null;
  
  const data = snapshot.val();
  const entries = Object.values(data) as ReflectionEntry[];
  return entries.sort((a, b) => b.timestamp - a.timestamp)[0];
}
