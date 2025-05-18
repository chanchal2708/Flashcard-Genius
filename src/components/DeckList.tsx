import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, ChevronRight } from 'lucide-react';
import { FlashcardDeck } from '../models/types';
import { useFlashcardStore } from '../store/flashcardStore';

interface DeckListProps {
  decks: Record<string, FlashcardDeck>;
  onSelectDeck: (deckId: string) => void;
  onCreateDeck: () => void;
}

const DeckList: React.FC<DeckListProps> = ({ 
  decks, 
  onSelectDeck, 
  onCreateDeck 
}) => {
  const { getDueCards } = useFlashcardStore();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  // Format date to be more readable
  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Check if there are any decks
  const hasDeck = Object.keys(decks).length > 0;
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-900">Your Decks</h2>
        <motion.button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium flex items-center hover:bg-indigo-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateDeck}
        >
          <Plus size={16} className="mr-1" />
          New Deck
        </motion.button>
      </div>
      
      {!hasDeck ? (
        <motion.div 
          className="text-center py-20 bg-gradient-to-b from-indigo-50 to-purple-50 rounded-2xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BookOpen size={48} className="mx-auto text-indigo-400 mb-4" />
          <h3 className="text-xl font-medium text-indigo-800 mb-2">No decks yet</h3>
          <p className="text-indigo-600 mb-6 max-w-md mx-auto">
            Create your first flashcard deck to start learning with spaced repetition.
          </p>
          <motion.button
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium flex items-center mx-auto hover:bg-indigo-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateDeck}
          >
            <Plus size={16} className="mr-2" />
            Create Your First Deck
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {Object.values(decks).map(deck => {
            const dueCards = getDueCards(deck.id).length;
            
            return (
              <motion.div
                key={deck.id}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer border border-indigo-50 transition-all"
                variants={itemVariants}
                onClick={() => onSelectDeck(deck.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-indigo-900">{deck.name}</h3>
                    <p className="text-indigo-600 text-sm">{deck.cards.length} cards • Last reviewed: {formatDate(deck.lastReviewed)}</p>
                  </div>
                  <div className="flex items-center">
                    {dueCards > 0 && (
                      <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
                        {dueCards} due
                      </div>
                    )}
                    <ChevronRight size={20} className="text-indigo-400" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default DeckList;