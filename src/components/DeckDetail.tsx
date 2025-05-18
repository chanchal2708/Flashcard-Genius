import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X, Edit2 } from 'lucide-react';
import { useFlashcardStore } from '../store/flashcardStore';
import { Flashcard } from '../models/types';

interface DeckDetailProps {
  deckId: string;
  onBack: () => void;
  onStartReview: () => void;
}

const DeckDetail: React.FC<DeckDetailProps> = ({ 
  deckId, 
  onBack,
  onStartReview
}) => {
  const { decks, cards, getCardsForDeck, addCard } = useFlashcardStore();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  
  const deck = decks[deckId];
  const deckCards: Flashcard[] = getCardsForDeck(deckId);
  
  if (!deck) return null;
  
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      addCard(deckId, question.trim(), answer.trim());
      setQuestion('');
      setAnswer('');
      setIsAddingCard(false);
    }
  };
  
  const toggleCard = (cardId: string) => {
    setExpandedCardId(expandedCardId === cardId ? null : cardId);
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      }
    }),
    exit: { opacity: 0, y: -20 }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <motion.button
            className="mr-4 p-2 rounded-full bg-indigo-100 text-indigo-700"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div>
            <h2 className="text-2xl font-bold text-indigo-900">{deck.name}</h2>
            <p className="text-indigo-600 text-sm">{deckCards.length} cards</p>
          </div>
        </div>
        
        <motion.button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartReview}
        >
          Start Review
        </motion.button>
      </div>
      
      {/* Description */}
      {deck.description && (
        <div className="bg-white bg-opacity-70 p-4 rounded-xl mb-6">
          <p className="text-indigo-800">{deck.description}</p>
        </div>
      )}
      
      {/* Add Card Button */}
      {!isAddingCard ? (
        <motion.button
          className="w-full p-4 mb-6 rounded-xl bg-gradient-to-r from-purple-100 to-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center space-x-2"
          onClick={() => setIsAddingCard(true)}
          whileHover={{ scale: 1.01, boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.99 }}
        >
          <Plus size={18} />
          <span className="font-medium">Add New Card</span>
        </motion.button>
      ) : (
        <motion.div
          className="bg-white p-6 rounded-xl shadow-md mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-indigo-900">Add New Card</h3>
            <motion.button 
              className="text-gray-500 hover:text-gray-700"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddingCard(false)}
            >
              <X size={18} />
            </motion.button>
          </div>
          
          <form onSubmit={handleAddCard}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-indigo-700 mb-1">
                Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none h-24"
                placeholder="Enter the question..."
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-indigo-700 mb-1">
                Answer
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none h-24"
                placeholder="Enter the answer..."
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <motion.button
                type="button"
                className="px-4 py-2 text-indigo-600 rounded-lg hover:bg-indigo-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingCard(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Card
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Card List */}
      <h3 className="text-xl font-medium text-indigo-900 mb-4">Cards</h3>
      {deckCards.length === 0 ? (
        <div className="text-center py-10 bg-white bg-opacity-70 rounded-xl">
          <p className="text-indigo-600">This deck doesn't have any cards yet.</p>
          <p className="text-indigo-500 mt-2">Add your first card to get started!</p>
        </div>
      ) : (
        <motion.div className="space-y-3">
          <AnimatePresence>
            {deckCards.map((card, index) => (
              <motion.div 
                key={card.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={index}
                layoutId={`card-${card.id}`}
                onClick={() => toggleCard(card.id)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <p className="text-indigo-900 font-medium">{card.question}</p>
                    <Edit2 size={16} className="text-indigo-400" />
                  </div>
                  
                  {expandedCardId === card.id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-indigo-100"
                    >
                      <p className="text-indigo-700">{card.answer}</p>
                      
                      <div className="mt-2 flex justify-between text-xs text-indigo-500">
                        <span>Reviews: {card.reviews}</span>
                        <span>Correct: {card.correct}</span>
                        <span>Ease: {card.easeFactor.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default DeckDetail;