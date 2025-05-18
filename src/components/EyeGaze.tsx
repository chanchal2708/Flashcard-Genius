import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface EyeGazeProps {
  enabled?: boolean;
  scale?: number;
  blinkInterval?: number;
}

const EyeGaze: React.FC<EyeGazeProps> = ({ 
  enabled = true,
  scale = 1,
  blinkInterval = 4000
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Update mouse position for eye tracking
  useEffect(() => {
    if (!enabled) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        
        // Calculate relative position from center of container
        setMousePosition({
          x: (e.clientX - centerX) / 100,
          y: (e.clientY - centerY) / 100,
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enabled]);
  
  // Handle eye blinking
  useEffect(() => {
    if (!enabled) return;
    
    const blinkTimer = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, blinkInterval);
    
    return () => clearInterval(blinkTimer);
  }, [enabled, blinkInterval]);
  
  if (!enabled) return null;
  
  // Limit eye movement
  const limitedX = Math.min(3, Math.max(-3, mousePosition.x));
  const limitedY = Math.min(2, Math.max(-2, mousePosition.y));
  
  return (
    <div 
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 opacity-80"
      style={{ transform: `scale(${scale})` }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Left eye */}
        <div className="relative mx-4 w-16 h-16 rounded-full bg-white shadow-inner overflow-hidden">
          <motion.div 
            className="absolute w-8 h-8 rounded-full bg-indigo-800"
            animate={{ 
              x: isBlinking ? 0 : limitedX * 5, 
              y: isBlinking ? 0 : limitedY * 5,
              scale: isBlinking ? [1, 0.1, 1] : 1,
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              scale: { duration: 0.2 }
            }}
            style={{ 
              top: '50%', 
              left: '50%', 
              marginLeft: -16, 
              marginTop: -16 
            }}
          >
            <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white opacity-70"></div>
          </motion.div>
        </div>
        
        {/* Right eye */}
        <div className="relative mx-4 w-16 h-16 rounded-full bg-white shadow-inner overflow-hidden">
          <motion.div 
            className="absolute w-8 h-8 rounded-full bg-indigo-800"
            animate={{ 
              x: isBlinking ? 0 : limitedX * 5, 
              y: isBlinking ? 0 : limitedY * 5,
              scale: isBlinking ? [1, 0.1, 1] : 1,
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              scale: { duration: 0.2 }
            }}
            style={{ 
              top: '50%', 
              left: '50%', 
              marginLeft: -16, 
              marginTop: -16 
            }}
          >
            <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white opacity-70"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EyeGaze;