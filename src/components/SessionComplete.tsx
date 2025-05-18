import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, BarChart, Repeat, Home } from 'lucide-react';
import { useFlashcardStore } from '../store/flashcardStore';

interface SessionCompleteProps {
  deckId: string | null;
  onRestart: () => void;
  onGoHome: () => void;
  onShowStats: () => void;
  totalCards: number;
}

const SessionComplete: React.FC<SessionCompleteProps> = ({
  deckId,
  onRestart,
  onGoHome,
  onShowStats,
  totalCards
}) => {
  const { stats } = useFlashcardStore();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // Confetti animation
  const confettiVariants = {
    initial: { y: -10, opacity: 0 },
    animate: (i: number) => ({
      y: 20,
      opacity: [0, 1, 0],
      x: Math.sin(i * 5) * 20,
      transition: {
        repeat: Infinity,
        repeatType: 'mirror' as const,
        duration: 1 + Math.random() * 2,
        delay: Math.random(),
      }
    })
  };
  
  const confettiColors = [
    "bg-indigo-400", 
    "bg-purple-400", 
    "bg-pink-400", 
    "bg-blue-400", 
    "bg-green-400"
  ];
  
  return (
    <div className="relative min-h-full flex items-center justify-center p-4">
      {/* Confetti animation */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={confettiVariants}
          initial="initial"
          animate="animate"
          className={`absolute w-3 h-3 rounded-full ${confettiColors[i % confettiColors.length]}`}
          style={{
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
      
      <motion.div 
        className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">Session Complete!</h2>
          <p className="text-indigo-700 mb-8">
            Great job! You reviewed {totalCards} {totalCards === 1 ? 'card' : 'cards'} today.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-8"
          variants={itemVariants}
        >
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-800 text-sm">Streak</p>
            <p className="text-2xl font-bold text-purple-900">{stats.streakDays} days</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-indigo-800 text-sm">Retention</p>
            <p className="text-2xl font-bold text-indigo-900">{stats.retention.toFixed(0)}%</p>
          </div>
        </motion.div>
        
        <motion.div className="flex flex-col space-y-3" variants={itemVariants}>
          <motion.button
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onShowStats}
          >
            <BarChart size={18} className="mr-2" />
            See My Progress
          </motion.button>
          
          <motion.button
            className="w-full py-3 bg-purple-100 text-purple-700 rounded-lg font-medium flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
          >
            <Repeat size={18} className="mr-2" />
            Study Again
          </motion.button>
          
          <motion.button
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGoHome}
          >
            <Home size={18} className="mr-2" />
            Back to Decks
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SessionComplete;