import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flashcard as FlashcardType } from '../models/types';
import { GradingChoice } from '../models/types';

interface FlashcardProps {
  card: FlashcardType;
  onGrade?: (grade: number) => void;
  onSkip?: () => void;
  gradingChoices?: GradingChoice[];
  showAnswer?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ 
  card, 
  onGrade, 
  onSkip,
  gradingChoices = [],
  showAnswer: initialShowAnswer = false,
}) => {
  const [showAnswer, setShowAnswer] = useState(initialShowAnswer);
  const [isFlipping, setIsFlipping] = useState(false);
  
  const handleFlip = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      setShowAnswer(!showAnswer);
      setIsFlipping(false);
    }, 300);
  };
  
  const handleGrade = (grade: number) => {
    if (onGrade) {
      onGrade(grade);
      setShowAnswer(false);
    }
  };
  
  return (
    <div className="flashcard relative mx-auto max-w-md w-full p-4">
      <motion.div
        className="relative w-full h-80 perspective-1000"
        initial={false}
        animate={{ rotateY: showAnswer ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
      >
        {/* Front side (Question) */}
        <motion.div 
          className={`absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col 
                     shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50
                     ${showAnswer ? 'pointer-events-none' : 'cursor-pointer'}`}
          onClick={handleFlip}
          style={{ 
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d" 
          }}
        >
          <div className="flex-1 flex items-center justify-center text-center">
            <h3 className="text-xl font-medium text-indigo-900">{card.question}</h3>
          </div>
          <div className="mt-4 text-center text-indigo-600 text-sm font-medium">
            Tap to reveal answer
          </div>
        </motion.div>
        
        {/* Back side (Answer) */}
        <motion.div 
          className={`absolute w-full h-full backface-hidden rounded-xl p-6 
                     shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50
                     ${!showAnswer ? 'pointer-events-none' : ''}`}
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            transformStyle: "preserve-3d" 
          }}
        >
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="text-xl font-medium text-indigo-900">{card.answer}</p>
          </div>
          
          {onGrade && gradingChoices.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {gradingChoices.map((choice) => (
                <button
                  key={choice.value}
                  className={`py-2 px-1 rounded-lg text-sm font-medium ${choice.color}`}
                  onClick={() => handleGrade(choice.value)}
                  title={choice.description}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
      
      {onSkip && (
        <div className="absolute right-8 top-4">
          <button 
            className="text-indigo-500 hover:text-indigo-700 font-medium px-2 py-1 text-sm"
            onClick={onSkip}
          >
            Skip
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard;