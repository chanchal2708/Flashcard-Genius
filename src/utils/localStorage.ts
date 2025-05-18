import { Flashcard, FlashcardDeck, StudySession, ReviewStats } from '../models/types';

// Storage keys
const STORAGE_KEYS = {
  CARDS: 'flashcards',
  DECKS: 'flashcard-decks',
  SESSION: 'study-session',
  STATS: 'review-stats',
};

// Save cards to localStorage
export function saveCards(cards: Record<string, Flashcard>) {
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
}

// Load cards from localStorage
export function loadCards(): Record<string, Flashcard> {
  const data = localStorage.getItem(STORAGE_KEYS.CARDS);
  return data ? JSON.parse(data) : {};
}

// Save decks to localStorage
export function saveDecks(decks: Record<string, FlashcardDeck>) {
  localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
}

// Load decks from localStorage
export function loadDecks(): Record<string, FlashcardDeck> {
  const data = localStorage.getItem(STORAGE_KEYS.DECKS);
  return data ? JSON.parse(data) : {};
}

// Save current study session
export function saveSession(session: StudySession) {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

// Load current study session
export function loadSession(): StudySession | null {
  const data = localStorage.getItem(STORAGE_KEYS.SESSION);
  return data ? JSON.parse(data) : null;
}

// Clear current session
export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// Save review statistics
export function saveStats(stats: ReviewStats) {
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
}

// Load review statistics
export function loadStats(): ReviewStats {
  const data = localStorage.getItem(STORAGE_KEYS.STATS);
  if (data) {
    return JSON.parse(data);
  }
  
  // Initialize with default values
  return {
    totalReviews: 0,
    correctReviews: 0,
    retention: 0,
    streakDays: 0,
    cardsLearned: 0,
    cardsToReview: 0,
    averageEase: 0,
    dailyReviews: [],
  };
}

// Check if app data exists
export function hasAppData(): boolean {
  return !!localStorage.getItem(STORAGE_KEYS.CARDS) || 
         !!localStorage.getItem(STORAGE_KEYS.DECKS);
}

// Clear all app data (for reset)
export function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.CARDS);
  localStorage.removeItem(STORAGE_KEYS.DECKS);
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  localStorage.removeItem(STORAGE_KEYS.STATS);
}