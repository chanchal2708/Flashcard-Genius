import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type CursorVariant = 'default' | 'button' | 'card' | 'text';

interface CustomCursorProps {
  enabled?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ enabled = true }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  
  useEffect(() => {
    if (!enabled) return;
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      if (!visible) setVisible(true);
      
      // Detect what the cursor is hovering over
      const element = document.elementFromPoint(e.clientX, e.clientY);
      
      if (element) {
        if (element.tagName === 'BUTTON' || 
            element.closest('button') || 
            element.closest('[role="button"]') ||
            element.closest('a')) {
          setVariant('button');
        } else if (element.closest('.flashcard')) {
          setVariant('card');
        } else if (element.tagName === 'INPUT' || 
                  element.tagName === 'TEXTAREA' ||
                  element.closest('input') ||
                  element.closest('textarea')) {
          setVariant('text');
        } else {
          setVariant('default');
        }
      }
    };
    
    const handleMouseLeave = () => {
      setVisible(false);
    };
    
    const handleMouseEnter = () => {
      setVisible(true);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [enabled, visible]);
  
  if (!enabled) return null;
  
  const variants = {
    default: {
      width: 28,
      height: 28,
      x: position.x - 14,
      y: position.y - 14,
      backgroundColor: "rgba(155, 155, 255, 0.2)",
      mixBlendMode: "difference" as "difference",
      border: "1.5px solid rgba(255, 255, 255, 0.5)",
    },
    button: {
      width: 48,
      height: 48,
      x: position.x - 24,
      y: position.y - 24,
      backgroundColor: "rgba(123, 104, 238, 0.2)",
      mixBlendMode: "difference" as "difference",
      border: "2px solid #8A2BE2",
      scale: 1.2,
    },
    card: {
      width: 100,
      height: 100,
      x: position.x - 50,
      y: position.y - 50,
      backgroundColor: "rgba(123, 104, 238, 0.1)",
      mixBlendMode: "normal" as "normal",
      border: "1.5px solid rgba(123, 104, 238, 0.3)",
      scale: 1,
    },
    text: {
      width: 10,
      height: 30,
      x: position.x - 5,
      y: position.y - 15,
      backgroundColor: "#8A2BE2",
      mixBlendMode: "normal" as "normal",
      border: "none",
    },
  };
  
  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 rounded-full"
      animate={variant}
      variants={variants}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 500,
        mass: 0.2,
      }}
      style={{
        opacity: visible ? 1 : 0,
      }}
    />
  );
};

export default CustomCursor;