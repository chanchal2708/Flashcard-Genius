import { create } from 'zustand';
import { Flashcard, FlashcardDeck, StudySession, ReviewStats } from '../models/types';
import * as storage from '../utils/localStorage';
import { calculateNextReview, isDue, getInitialValues, GRADE } from '../utils/spacedRepetition';
import { v4 as uuidv4 } from '../utils/uuid';

interface FlashcardState {
  cards: Record<string, Flashcard>;
  decks: Record<string, FlashcardDeck>;
  session: StudySession | null;
  stats: ReviewStats;
  isInitialized: boolean;
  
  // Card operations
  addCard: (deckId: string, question: string, answer: string) => string;
  updateCard: (id: string, updates: Partial<Flashcard>) => void;
  deleteCard: (id: string) => void;
  
  // Deck operations
  createDeck: (name: string, description: string) => string;
  updateDeck: (id: string, updates: Partial<FlashcardDeck>) => void;
  deleteDeck: (id: string) => void;
  
  // Study session operations
  startStudySession: (deckId: string | null) => void;
  endStudySession: () => void;
  gradeCard: (grade: number) => void;
  skipCard: () => void;
  
  // Initialization
  initialize: () => void;
  reset: () => void;
  
  // Utility methods
  getDueCards: (deckId?: string) => Flashcard[];
  getCardsForDeck: (deckId: string) => Flashcard[];
  getCurrentCard: () => Flashcard | null;
  updateStats: () => void;
}

// Create the store
export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  cards: {},
  decks: {},
  session: null,
  stats: {
    totalReviews: 0,
    correctReviews: 0,
    retention: 0,
    streakDays: 0,
    cardsLearned: 0,
    cardsToReview: 0,
    averageEase: 0,
    dailyReviews: [],
  },
  isInitialized: false,
  
  // Initialize the store with data from localStorage
  initialize: () => {
    if (get().isInitialized) return;
    
    const cards = storage.loadCards();
    const decks = storage.loadDecks();
    const session = storage.loadSession();
    const stats = storage.loadStats();
    
    // Update card due counts
    const dueCards = Object.values(cards).filter(card => isDue(card.nextReview)).length;
    stats.cardsToReview = dueCards;
    
    set({ 
      cards, 
      decks, 
      session, 
      stats, 
      isInitialized: true 
    });
  },
  
  // Reset all data
  reset: () => {
    storage.clearAllData();
    set({
      cards: {},
      decks: {},
      session: null,
      stats: {
        totalReviews: 0,
        correctReviews: 0,
        retention: 0,
        streakDays: 0,
        cardsLearned: 0,
        cardsToReview: 0,
        averageEase: 0,
        dailyReviews: [],
      },
    });
  },
  
  // Card operations
  addCard: (deckId, question, answer) => {
    const id = uuidv4();
    const now = Date.now();
    
    // Create new card with initial spaced repetition values
    const newCard: Flashcard = {
      id,
      question,
      answer,
      created: now,
      ...getInitialValues(),
    };
    
    set(state => {
      // Add card to collection
      const updatedCards = { ...state.cards, [id]: newCard };
      
      // Add card to deck
      const deck = { ...state.decks[deckId] };
      deck.cards = [...deck.cards, id];
      const updatedDecks = { ...state.decks, [deckId]: deck };
      
      // Update stats
      const stats = { ...state.stats };
      stats.cardsToReview++;
      
      storage.saveCards(updatedCards);
      storage.saveDecks(updatedDecks);
      storage.saveStats(stats);
      
      return { 
        cards: updatedCards, 
        decks: updatedDecks,
        stats
      };
    });
    
    return id;
  },
  
  updateCard: (id, updates) => {
    set(state => {
      if (!state.cards[id]) return state;
      
      const updatedCard = { ...state.cards[id], ...updates };
      const updatedCards = { ...state.cards, [id]: updatedCard };
      
      storage.saveCards(updatedCards);
      return { cards: updatedCards };
    });
  },
  
  deleteCard: (id) => {
    set(state => {
      if (!state.cards[id]) return state;
      
      // Create new objects without the deleted card
      const { [id]: removedCard, ...remainingCards } = state.cards;
      
      // Remove card from all decks that contain it
      const updatedDecks = { ...state.decks };
      Object.keys(updatedDecks).forEach(deckId => {
        if (updatedDecks[deckId].cards.includes(id)) {
          updatedDecks[deckId] = {
            ...updatedDecks[deckId],
            cards: updatedDecks[deckId].cards.filter(cardId => cardId !== id),
          };
        }
      });
      
      storage.saveCards(remainingCards);
      storage.saveDecks(updatedDecks);
      
      return { 
        cards: remainingCards,
        decks: updatedDecks,
      };
    });
  },
  
  // Deck operations
  createDeck: (name, description) => {
    const id = uuidv4();
    const now = Date.now();
    
    const newDeck: FlashcardDeck = {
      id,
      name,
      description,
      created: now,
      lastReviewed: null,
      cards: [],
    };
    
    set(state => {
      const updatedDecks = { ...state.decks, [id]: newDeck };
      storage.saveDecks(updatedDecks);
      return { decks: updatedDecks };
    });
    
    return id;
  },
  
  updateDeck: (id, updates) => {
    set(state => {
      if (!state.decks[id]) return state;
      
      const updatedDeck = { ...state.decks[id], ...updates };
      const updatedDecks = { ...state.decks, [id]: updatedDeck };
      
      storage.saveDecks(updatedDecks);
      return { decks: updatedDecks };
    });
  },
  
  deleteDeck: (id) => {
    set(state => {
      if (!state.decks[id]) return state;
      
      // Create new object without the deleted deck
      const { [id]: removedDeck, ...remainingDecks } = state.decks;
      
      storage.saveDecks(remainingDecks);
      return { decks: remainingDecks };
    });
  },
  
  // Study session operations
  startStudySession: (deckId) => {
    const state = get();
    let cardIds: string[] = [];
    
    if (deckId) {
      // Study cards from a specific deck
      cardIds = state.getCardsForDeck(deckId)
        .filter(card => isDue(card.nextReview))
        .map(card => card.id);
    } else {
      // Study all due cards
      cardIds = state.getDueCards().map(card => card.id);
    }
    
    if (cardIds.length === 0) return;
    
    const session: StudySession = {
      deckId,
      cardIds,
      currentCardIndex: 0,
      startTime: Date.now(),
      endTime: null,
      isActive: true,
    };
    
    set({ session });
    storage.saveSession(session);
  },
  
  endStudySession: () => {
    set(state => {
      if (!state.session) return state;
      
      const endedSession = {
        ...state.session,
        endTime: Date.now(),
        isActive: false,
      };
      
      storage.clearSession();
      return { session: null };
    });
  },
  
  gradeCard: (grade) => {
    const state = get();
    if (!state.session || !state.session.isActive) return;
    
    const { session, cards } = state;
    const cardId = session.cardIds[session.currentCardIndex];
    const card = cards[cardId];
    
    if (!card) return;
    
    // Calculate next review details based on grade
    const { interval, easeFactor, nextReview } = calculateNextReview(
      grade,
      card.interval,
      card.easeFactor
    );
    
    // Update card with new spaced repetition values
    const isCorrect = grade >= GRADE.GOOD;
    const updatedCard: Flashcard = {
      ...card,
      lastReviewed: Date.now(),
      nextReview,
      interval,
      easeFactor,
      reviews: card.reviews + 1,
      correct: card.correct + (isCorrect ? 1 : 0),
      streak: isCorrect ? card.streak + 1 : 0,
    };
    
    // Update state
    set(state => {
      const updatedCards = { ...state.cards, [cardId]: updatedCard };
      
      // Move to next card if available
      const nextIndex = session.currentCardIndex + 1;
      const updatedSession = {
        ...session,
        currentCardIndex: nextIndex,
      };
      
      // Check if session is complete
      if (nextIndex >= session.cardIds.length) {
        updatedSession.isActive = false;
        updatedSession.endTime = Date.now();
        storage.clearSession();
      } else {
        storage.saveSession(updatedSession);
      }
      
      // Update the deck's last reviewed time if applicable
      let updatedDecks = { ...state.decks };
      if (session.deckId) {
        updatedDecks = {
          ...updatedDecks,
          [session.deckId]: {
            ...updatedDecks[session.deckId],
            lastReviewed: Date.now(),
          },
        };
      }
      
      storage.saveCards(updatedCards);
      storage.saveDecks(updatedDecks);
      
      // Update stats
      state.updateStats();
      
      return {
        cards: updatedCards,
        decks: updatedDecks,
        session: updatedSession.isActive ? updatedSession : null,
      };
    });
  },
  
  skipCard: () => {
    const { session } = get();
    if (!session || !session.isActive) return;
    
    // Move to next card
    const nextIndex = session.currentCardIndex + 1;
    
    set(state => {
      if (nextIndex >= session.cardIds.length) {
        // End session if no more cards
        const endedSession = {
          ...session,
          endTime: Date.now(),
          isActive: false,
        };
        storage.clearSession();
        return { session: null };
      } else {
        // Move to next card
        const updatedSession = {
          ...session,
          currentCardIndex: nextIndex,
        };
        storage.saveSession(updatedSession);
        return { session: updatedSession };
      }
    });
  },
  
  // Utility methods
  getDueCards: (deckId) => {
    const { cards, decks } = get();
    let cardList = Object.values(cards);
    
    if (deckId) {
      const deck = decks[deckId];
      if (deck) {
        cardList = deck.cards
          .map(id => cards[id])
          .filter(Boolean);
      }
    }
    
    return cardList.filter(card => isDue(card.nextReview));
  },
  
  getCardsForDeck: (deckId) => {
    const { cards, decks } = get();
    const deck = decks[deckId];
    
    if (!deck) return [];
    
    return deck.cards
      .map(id => cards[id])
      .filter(Boolean);
  },
  
  getCurrentCard: () => {
    const { session, cards } = get();
    if (!session || !session.isActive) return null;
    
    const cardId = session.cardIds[session.currentCardIndex];
    return cards[cardId] || null;
  },
  
  updateStats: () => {
    set(state => {
      const { cards } = state;
      const allCards = Object.values(cards);
      
      // Calculate statistics
      const totalReviews = allCards.reduce((sum, card) => sum + card.reviews, 0);
      const correctReviews = allCards.reduce((sum, card) => sum + card.correct, 0);
      const retention = totalReviews > 0 ? (correctReviews / totalReviews) * 100 : 0;
      const cardsLearned = allCards.filter(card => card.reviews > 0).length;
      const cardsToReview = allCards.filter(card => isDue(card.nextReview)).length;
      const averageEase = allCards.length > 0
        ? allCards.reduce((sum, card) => sum + card.easeFactor, 0) / allCards.length
        : 0;
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Update daily reviews
      let dailyReviews = [...state.stats.dailyReviews];
      const todayIndex = dailyReviews.findIndex(day => day.date === today);
      
      if (todayIndex >= 0) {
        // Update existing entry for today
        dailyReviews[todayIndex] = {
          ...dailyReviews[todayIndex],
          count: totalReviews,
          correct: correctReviews,
        };
      } else {
        // Add new entry for today
        dailyReviews.push({
          date: today,
          count: totalReviews,
          correct: correctReviews,
        });
        
        // Keep only the last 30 days
        if (dailyReviews.length > 30) {
          dailyReviews = dailyReviews.slice(-30);
        }
      }
      
      // Calculate streak days
      let streakDays = 0;
      if (dailyReviews.length > 0) {
        // Check if reviewed today
        if (dailyReviews[dailyReviews.length - 1].date === today && 
            dailyReviews[dailyReviews.length - 1].count > 0) {
          streakDays = 1;
          
          // Check previous consecutive days
          const sortedDates = [...dailyReviews]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          let currentDate = new Date(today);
          currentDate.setDate(currentDate.getDate() - 1);
          
          for (let i = 1; i < sortedDates.length; i++) {
            const expectedDate = currentDate.toISOString().split('T')[0];
            const entry = sortedDates.find(d => d.date === expectedDate);
            
            if (entry && entry.count > 0) {
              streakDays++;
              currentDate.setDate(currentDate.getDate() - 1);
            } else {
              break;
            }
          }
        }
      }
      
      const updatedStats = {
        totalReviews,
        correctReviews,
        retention,
        streakDays,
        cardsLearned,
        cardsToReview,
        averageEase,
        dailyReviews,
      };
      
      storage.saveStats(updatedStats);
      
      return { stats: updatedStats };
    });
  },
}));