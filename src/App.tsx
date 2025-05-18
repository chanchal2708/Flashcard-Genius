import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, BarChart3, BookOpen, Brain, Zap, Clock, HelpCircle, BookCheck, MessageCircle } from 'lucide-react';
import DeckList from './components/DeckList';
import CreateDeckModal from './components/CreateDeckModal';
import ReviewSession from './components/ReviewSession';
import Statistics from './components/Statistics';
import CustomCursor from './components/CustomCursor';
import EyeGaze from './components/EyeGaze';
import { useFlashcardStore } from './store/flashcardStore';

// View types for app navigation
type View = 'decks' | 'review' | 'stats';

function App() {
  // State management
  const [view, setView] = useState<View>('decks');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showEyeGaze, setShowEyeGaze] = useState(true);
  
  // Access store data and methods
  const { 
    decks, 
    initialize, 
    isInitialized, 
    createDeck, 
    startStudySession,
    updateStats,
    stats 
  } = useFlashcardStore();

  // Initialize app data from localStorage
  useEffect(() => {
    if (!isInitialized) {
      initialize();
      updateStats();
    }
  }, [initialize, isInitialized, updateStats]);

  // Handle deck creation
  const handleCreateDeck = (name: string, description: string) => {
    const deckId = createDeck(name, description);
    setIsCreateModalOpen(false);
    setSelectedDeckId(deckId);
  };

  // Handle deck selection
  const handleSelectDeck = (deckId: string) => {
    setSelectedDeckId(deckId);
    startStudySession(deckId);
    setView('review');
  };

  // Handle review session completion
  const handleReviewComplete = () => {
    setView('stats');
    updateStats();
  };

  // Variants for animation
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  // Toggle eye gaze animation
  const toggleEyeGaze = () => {
    setShowEyeGaze(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Custom cursor */}
      <CustomCursor enabled={true} />
      
      {/* Eye gaze animation */}
      <div className="fixed top-10 left-1/2 transform -translate-x-1/2">
        <EyeGaze enabled={showEyeGaze} scale={0.8} blinkInterval={3500} />
      </div>
      
      {/* Navigation */}
      <nav className="p-4 flex items-center justify-between bg-white bg-opacity-70 backdrop-blur-sm shadow-sm relative z-10">
        <div className="flex items-center space-x-2">
          <BookOpen className="text-indigo-600" size={24} />
          <h1 className="text-xl font-bold text-indigo-900">Flashcard Genius</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg ${view === 'decks' ? 'bg-indigo-100 text-indigo-700' : 'text-indigo-600'}`}
            onClick={() => setView('decks')}
          >
            <BookOpen size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg ${view === 'stats' ? 'bg-indigo-100 text-indigo-700' : 'text-indigo-600'}`}
            onClick={() => setView('stats')}
          >
            <BarChart3 size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-100"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle size={20} />
          </motion.button>
        </div>
      </nav>
      
      {/* Toggle for eye animation */}
      <div className="absolute top-20 right-4 z-10">
        <motion.button
          className={`px-4 py-2 rounded-lg text-sm font-medium ${showEyeGaze ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-200 text-gray-700'}`}
          onClick={toggleEyeGaze}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showEyeGaze ? '👁️ Hide Eyes' : '👁️ Show Eyes'}
        </motion.button>
      </div>
      
      {/* Main content */}
      <main className="container mx-auto py-10 px-4 relative z-0 mt-10">
        {/* Hero Section */}
        {view === 'decks' && Object.keys(decks).length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Master Any Subject with
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"> Smart Flashcards</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-indigo-700 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Enhance your learning with our intelligent spaced repetition system. Create, study, and track your progress with beautiful animated flashcards.
            </motion.p>
            
            <motion.button
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium text-lg shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Start Learning Now
            </motion.button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {view === 'decks' && (
            <motion.div
              key="decks"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
            >
              <DeckList 
                decks={decks} 
                onSelectDeck={handleSelectDeck} 
                onCreateDeck={() => setIsCreateModalOpen(true)}
              />
            </motion.div>
          )}
          
          {view === 'review' && (
            <motion.div
              key="review"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              className="h-[90vh] flex flex-col"
            >
              <ReviewSession onComplete={handleReviewComplete} />
            </motion.div>
          )}
          
          {view === 'stats' && (
            <motion.div
              key="stats"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
            >
              <Statistics stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Section */}
        {view === 'decks' && Object.keys(decks).length === 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Brain className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-2">Smart Learning</h3>
              <p className="text-purple-700">Our system understands how you learn and adjusts review timing, so you remember better without feeling overwhelmed.

</p>
            </div>
            
            <div className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-indigo-900 mb-2">Interactive Design</h3>
              <p className="text-indigo-700">Beautiful animations and eye-tracking features make learning engaging.</p>
            </div>
            
            <div className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-pink-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-pink-900 mb-2">Progress Tracking</h3>
              <p className="text-pink-700">Detailed statistics and insights to monitor your learning journey.</p>
            </div>
          </motion.div>
        )}

        {/* Help Center */}
        {view === 'decks' && Object.keys(decks).length === 0 && (
          <motion.div 
            className="mt-16 bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center mb-8">
              <HelpCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-indigo-900 mb-2">Help Center</h2>
              <p className="text-indigo-700">Get started with our helpful resources</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-indigo-100 rounded-xl hover:border-indigo-300 transition-colors">
                <BookCheck className="text-indigo-600 mb-2" size={20} />
                <h3 className="text-lg font-medium text-indigo-900 mb-1">Quick Start Guide</h3>
                <p className="text-indigo-700 text-sm">Learn the basics of creating and studying with flashcards.</p>
              </div>
              
              <div className="p-4 border border-indigo-100 rounded-xl hover:border-indigo-300 transition-colors">
                <MessageCircle className="text-indigo-600 mb-2" size={20} />
                <h3 className="text-lg font-medium text-indigo-900 mb-1">Support</h3>
                <p className="text-indigo-700 text-sm">Need help? Our support team is here to assist you.</p>
              </div>
            </div>
          </motion.div>
        )}
      </main>
      
      {/* Create deck modal */}
      <CreateDeckModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateDeck={handleCreateDeck}
      />
    </div>
  );
}

export default App;