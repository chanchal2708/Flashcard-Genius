export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  created: number;
  lastReviewed: number | null;
  nextReview: number | null;
  easeFactor: number;
  interval: number;
  reviews: number;
  correct: number;
  streak: number;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  created: number;
  lastReviewed: number | null;
  cards: string[]; // Array of card IDs
}

export interface ReviewStats {
  totalReviews: number;
  correctReviews: number;
  retention: number;
  streakDays: number;
  cardsLearned: number;
  cardsToReview: number;
  averageEase: number;
  dailyReviews: {
    date: string;
    count: number;
    correct: number;
  }[];
}

export interface StudySession {
  deckId: string | null;
  cardIds: string[];
  currentCardIndex: number;
  startTime: number;
  endTime: number | null;
  isActive: boolean;
}

export interface GradingChoice {
  label: string;
  value: number;
  color: string;
  description: string;
}