import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';

// Particle component
const Particle = ({ 
  x, 
  y, 
  targetX, 
  targetY, 
  size, 
  delay, 
  isForming 
}: { 
  x: number; 
  y: number; 
  targetX: number; 
  targetY: number; 
  size: number;
  delay: number;
  isForming: boolean;
}) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      initial={{ 
        x: isForming ? x : targetX, 
        y: isForming ? y : targetY,
        opacity: isForming ? 0 : 0.8,
        width: size,
        height: size,
      }}
      animate={{ 
        x: isForming ? targetX : x, 
        y: isForming ? targetY : y,
        opacity: isForming ? 0.8 : 0,
      }}
      transition={{ 
        duration: 1.5, 
        delay: delay,
        type: 'spring',
        damping: 15,
        stiffness: 100
      }}
      style={{ 
        boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.8)`,
      }}
    />
  );
};

// Main component
export default function AnimationTest() {
  const [isLoading, setIsLoading] = useState(true);
  const [isForming, setIsForming] = useState(true);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  // Generate random particles with their target positions
  const generateParticles = (count: number, width: number, height: number) => {
    const particles = [];
    
    // Define the message box dimensions
    const boxWidth = Math.min(500, width * 0.8);
    const boxHeight = 300;
    const boxLeft = (width - boxWidth) / 2;
    const boxTop = (height - boxHeight) / 2;
    
    // Create particles that will form the box outline
    const particlesPerSide = Math.floor(count / 4);
    const spacingH = boxWidth / particlesPerSide;
    const spacingV = boxHeight / particlesPerSide;
    
    // Top edge
    for (let i = 0; i < particlesPerSide; i++) {
      particles.push({
        id: particles.length,
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: boxLeft + i * spacingH,
        targetY: boxTop,
        size: 2 + Math.random() * 3,
        delay: 0.01 * particles.length
      });
    }
    
    // Right edge
    for (let i = 0; i < particlesPerSide; i++) {
      particles.push({
        id: particles.length,
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: boxLeft + boxWidth,
        targetY: boxTop + i * spacingV,
        size: 2 + Math.random() * 3,
        delay: 0.01 * particles.length
      });
    }
    
    // Bottom edge
    for (let i = 0; i < particlesPerSide; i++) {
      particles.push({
        id: particles.length,
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: boxLeft + boxWidth - i * spacingH,
        targetY: boxTop + boxHeight,
        size: 2 + Math.random() * 3,
        delay: 0.01 * particles.length
      });
    }
    
    // Left edge
    for (let i = 0; i < particlesPerSide; i++) {
      particles.push({
        id: particles.length,
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: boxLeft,
        targetY: boxTop + boxHeight - i * spacingV,
        size: 2 + Math.random() * 3,
        delay: 0.01 * particles.length
      });
    }
    
    return particles;
  };

  // Initialize particles
  const [particles, setParticles] = useState<any[]>([]);
  
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setParticles(generateParticles(120, clientWidth, clientHeight));
    }
    
    // Animation sequence
    const formingTimer = setTimeout(() => {
      setIsMessageVisible(true);
    }, 2000);
    
    return () => {
      clearTimeout(formingTimer);
    };
  }, []);
  
  const handleContinue = () => {
    setIsForming(false);
    setIsMessageVisible(false);
    
    // Wait for particles to disperse before showing content
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header with back button */}
      <header className="bg-gray-800 py-4 px-6">
        <div className="container mx-auto">
          <button 
            onClick={() => setLocation('/')} 
            className="flex items-center text-white hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 relative overflow-hidden" ref={containerRef}>
        {/* Actual page content (shown after animation) */}
        <AnimatePresence>
          {!isLoading && (
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
                Animation Playground
              </h1>
              <p className="text-xl max-w-2xl text-center mb-8">
                This page demonstrates advanced animation capabilities and effects that can be
                integrated into your web experiences.
              </p>
              <button 
                onClick={() => {
                  setIsLoading(true);
                  setIsForming(true);
                  setTimeout(() => {
                    setIsMessageVisible(true);
                  }, 2000);
                }}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-medium"
              >
                Replay Animation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Splash screen */}
        <AnimatePresence>
          {isLoading && (
            <div className="absolute inset-0">
              {/* Particles */}
              {particles.map((particle) => (
                <Particle
                  key={particle.id}
                  x={particle.x}
                  y={particle.y}
                  targetX={particle.targetX}
                  targetY={particle.targetY}
                  size={particle.size}
                  delay={particle.delay}
                  isForming={isForming}
                />
              ))}
              
              {/* Message box */}
              <AnimatePresence>
                {isMessageVisible && (
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-lg p-8 rounded-lg border border-white/20 text-white text-center w-4/5 max-w-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.h2 
                      className="text-2xl font-bold mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Welcome to the Animation Test
                    </motion.h2>
                    <motion.p
                      className="mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      This demonstration showcases particle effects and animated transitions that can enhance user experiences.
                    </motion.p>
                    <motion.button
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-medium"
                      onClick={handleContinue}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Continue
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}