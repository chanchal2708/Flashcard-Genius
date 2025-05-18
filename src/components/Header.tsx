import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Settings, HelpCircle } from 'lucide-react';

interface HeaderProps {
  showStudyButton?: boolean;
  onStartStudy?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  showStudyButton = false,
  onStartStudy,
  title = "Flashcard Genius"
}) => {
  return (
    <header className="sticky top-0 z-20 bg-white bg-opacity-80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: [0, -10, 0] }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "mirror", 
              duration: 2,
              ease: "easeInOut" 
            }}
          >
            <BookOpen className="text-indigo-600" size={24} />
          </motion.div>
          <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {showStudyButton && onStartStudy && (
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartStudy}
            >
              Start Studying
            </motion.button>
          )}
          
          <motion.button
            className="p-2 rounded-full text-indigo-600 hover:bg-indigo-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <HelpCircle size={20} />
          </motion.button>
          
          <motion.button
            className="p-2 rounded-full text-indigo-600 hover:bg-indigo-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings size={20} />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;