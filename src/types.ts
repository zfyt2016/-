/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ExerciseType {
  ENGLISH_TO_CHINESE = 'E2C',
  CHINESE_TO_ENGLISH = 'C2E',
  SPELLING = 'SPELL',
  PRONUNCIATION = 'SPEAK',
}

export interface Word {
  id: string;
  text: string;
  chinese: string;
  phonics: string[]; // e.g. ["ap", "ple"]
  phoneticSymbol?: string;
  category: string;
  examples: { en: string; zh: string }[];
}

export interface Level {
  id: string;
  title: string;
  words: string[]; // Word IDs
  unlocked: boolean;
  completed: boolean;
  starCount: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  completedLevels: string[];
  bookmarkedWords: string[];
  lastStudyDate: string;
}
