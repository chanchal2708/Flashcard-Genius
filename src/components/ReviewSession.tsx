import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Flashcard from './Flashcard';
import { useFlashcardStore } from '../store/flashcardStore';
import { getGradingChoices } from '../utils/spacedRepetition';

interface ReviewSessionProps {
  onComplete?: () => void;
}

const ReviewSession: React.FC<ReviewSessionProps> = ({ onComplete }) => {
  const { 
    session, 
    getCurrentCard, 
    gradeCard, 
    skipCard, 
    endStudySession
  } = useFlashcardStore();
  
  const currentCard = getCurrentCard();
  const gradingChoices = getGradingChoices();
  
  useEffect(() => {
    if (!session || session.cardIds.length === 0) {
      if (onComplete) onComplete();
    }
  }, [session, onComplete]);

  if (!session || !currentCard) {
    return null;
  }
  
  const progress = session ? 
    ((session.currentCardIndex) / session.cardIds.length) * 100 : 0;
  
  const handleComplete = () => {
    endStudySession();
    if (onComplete) onComplete();
  };
  
  return (
    <div className="min-h-full flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-2 bg-purple-100 relative">
        <motion.div 
          className="h-full bg-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="p-4 flex justify-between items-center">
        <div className="text-indigo-800 font-medium">
          Card {session.currentCardIndex + 1} of {session.cardIds.length}
        </div>
        <button 
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium text-sm hover:bg-indigo-200"
          onClick={handleComplete}
        >
          End Session
        </button>
      </div>
      
      <div className="flex-grow flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <Flashcard 
              card={currentCard} 
              onGrade={gradeCard}
              onSkip={skipCard}
              gradingChoices={gradingChoices}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReviewSession;