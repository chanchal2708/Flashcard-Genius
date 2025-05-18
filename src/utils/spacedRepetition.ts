/**
 * A spaced repetition system based on the SuperMemo SM-2 algorithm
 */

// Minimum and maximum interval values in days
const MIN_INTERVAL = 1;
const MAX_INTERVAL = 365;

// Minimum and maximum ease factor
const MIN_EASE = 1.3;
const MAX_EASE = 2.5;

// Default ease factor for new cards
const DEFAULT_EASE = 2.5;

// Grade constants for review feedback
export const GRADE = {
  AGAIN: 0,
  HARD: 1,
  GOOD: 2,
  EASY: 3,
};

/**
 * Calculate the next review date based on user's response
 */
export function calculateNextReview(grade: number, currentInterval: number, easeFactor: number) {
  let newInterval = currentInterval;
  let newEase = easeFactor;

  // Adjust ease factor based on performance
  if (grade === GRADE.AGAIN) {
    newEase = Math.max(MIN_EASE, easeFactor - 0.2);
    newInterval = MIN_INTERVAL;
  } else if (grade === GRADE.HARD) {
    newEase = Math.max(MIN_EASE, easeFactor - 0.15);
    newInterval = Math.max(MIN_INTERVAL, Math.round(currentInterval * 1.2));
  } else if (grade === GRADE.GOOD) {
    // No change to ease factor
    if (currentInterval === 0) {
      newInterval = 1; // First review
    } else if (currentInterval === 1) {
      newInterval = 3; // Second review
    } else {
      newInterval = Math.round(currentInterval * easeFactor);
    }
  } else if (grade === GRADE.EASY) {
    newEase = Math.min(MAX_EASE, easeFactor + 0.15);
    if (currentInterval === 0) {
      newInterval = 3; // First review, but easy
    } else if (currentInterval === 1) {
      newInterval = 5; // Second review, but easy
    } else {
      newInterval = Math.round(currentInterval * easeFactor * 1.3);
    }
  }

  // Enforce bounds
  newInterval = Math.min(MAX_INTERVAL, Math.max(MIN_INTERVAL, newInterval));
  newEase = Math.min(MAX_EASE, Math.max(MIN_EASE, newEase));

  // Calculate next review date
  const now = new Date();
  const nextReview = new Date(now);
  nextReview.setDate(now.getDate() + newInterval);

  return {
    interval: newInterval,
    easeFactor: newEase,
    nextReview: nextReview.getTime(),
  };
}

/**
 * Determine if a card is due for review
 */
export function isDue(nextReview: number | null) {
  if (nextReview === null) return true; // New card
  return Date.now() >= nextReview;
}

/**
 * Get initial spaced repetition values for a new card
 */
export function getInitialValues() {
  return {
    easeFactor: DEFAULT_EASE,
    interval: 0,
    nextReview: null,
    lastReviewed: null,
    reviews: 0,
    correct: 0,
    streak: 0,
  };
}

/**
 * Get grading choices with descriptions
 */
export function getGradingChoices() {
  return [
    {
      value: GRADE.AGAIN,
      label: "Again",
      color: "bg-red-200 hover:bg-red-300",
      description: "Completely forgot",
    },
    {
      value: GRADE.HARD,
      label: "Hard",
      color: "bg-orange-200 hover:bg-orange-300",
      description: "Remembered with difficulty",
    },
    {
      value: GRADE.GOOD,
      label: "Good",
      color: "bg-green-200 hover:bg-green-300",
      description: "Remembered with some effort",
    },
    {
      value: GRADE.EASY,
      label: "Easy",
      color: "bg-blue-200 hover:bg-blue-300",
      description: "Remembered easily",
    },
  ];
}