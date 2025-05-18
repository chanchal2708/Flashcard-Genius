import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDeck: (name: string, description: string) => void;
}

const CreateDeckModal: React.FC<CreateDeckModalProps> = ({
  isOpen,
  onClose,
  onCreateDeck,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateDeck(name.trim(), description.trim());
      setName('');
      setDescription('');
    }
  };
  
  // Framer Motion variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 300 } }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          
          <motion.div 
            className="bg-white rounded-xl max-w-md w-full shadow-lg relative z-10"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-indigo-900">Create New Deck</h2>
                <button 
                  className="text-indigo-400 hover:text-indigo-600 p-1"
                  onClick={onClose}
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="deckName" className="block text-sm font-medium text-indigo-700 mb-1">
                    Deck Name
                  </label>
                  <input
                    id="deckName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                    placeholder="e.g., Spanish Vocabulary"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="deckDescription" className="block text-sm font-medium text-indigo-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    id="deckDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none h-24"
                    placeholder="What are you learning with this deck?"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-indigo-600 rounded-lg hover:bg-indigo-50"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateDeckModal;