import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';

// Particle component for the animation
const Particle = ({ 
  x, 
  y, 
  targetX, 
  targetY, 
  size, 
  delay, 
  isForming,
  color = 'rgba(255, 255, 255, 0.8)',
  isVisible = true
}: { 
  x: number; 
  y: number; 
  targetX: number; 
  targetY: number; 
  size: number;
  delay: number;
  isForming: boolean;
  color?: string;
  isVisible?: boolean;
}) => {
  return (
    <motion.div
      className="absolute rounded-full"
      initial={{ 
        x: isForming ? x : targetX, 
        y: isForming ? y : targetY,
        opacity: isForming ? 0 : 0.9,
        width: size,
        height: size,
        backgroundColor: color
      }}
      animate={{ 
        x: isForming ? targetX : x, 
        y: isForming ? targetY : y,
        opacity: isVisible ? (isForming ? 0.9 : 0) : 0,
      }}
      transition={{ 
        duration: 1.8, 
        delay: delay,
        type: 'spring',
        damping: 20,
        stiffness: 90
      }}
      style={{ 
        boxShadow: `0 0 ${size * 1.5}px ${color}`,
      }}
    />
  );
};

// Main component
export default function AnimationTest() {
  const [isLoading, setIsLoading] = useState(true);
  const [isForming, setIsForming] = useState(true);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  // Helper function to generate a point on a parametric curve
  const getCurvePoint = (
    t: number, 
    centerX: number, 
    centerY: number, 
    width: number, 
    height: number, 
    curve: 'sine' | 'circle' | 'spiral' | 'lissajous' | 'heart'
  ) => {
    switch(curve) {
      case 'sine':
        return {
          x: centerX + (width/2) * Math.sin(t * Math.PI * 2),
          y: centerY + (height/2) * Math.sin(t * Math.PI * 2 * 2)
        };
      case 'circle':
        return {
          x: centerX + (width/2) * Math.cos(t * Math.PI * 2),
          y: centerY + (height/2) * Math.sin(t * Math.PI * 2)
        };
      case 'spiral':
        const spiralRadius = t * Math.min(width, height) * 0.35;
        return {
          x: centerX + spiralRadius * Math.cos(t * Math.PI * 10),
          y: centerY + spiralRadius * Math.sin(t * Math.PI * 10)
        };
      case 'lissajous':
        return {
          x: centerX + (width/2) * Math.sin(t * Math.PI * 2 * 3),
          y: centerY + (height/2) * Math.sin(t * Math.PI * 2 * 2)
        };
      case 'heart':
        // Heart curve
        const theta = t * Math.PI * 2;
        const scale = Math.min(width, height) * 0.25;
        return {
          x: centerX + scale * 16 * Math.pow(Math.sin(theta), 3),
          y: centerY - scale * (13 * Math.cos(theta) - 5 * Math.cos(2*theta) - 2 * Math.cos(3*theta) - Math.cos(4*theta))
        };
      default:
        return { x: centerX, y: centerY };
    }
  };

  // Generate particles along curves
  const generateParticles = (width: number, height: number) => {
    const particles = [];
    const centerX = width / 2;
    const centerY = height / 2;
    
    // For message box formation at the end
    const boxWidth = Math.min(400, width * 0.6);
    const boxHeight = 240;
    const boxLeft = centerX - boxWidth / 2;
    const boxTop = centerY - boxHeight / 2;
    
    // Parameters for curves
    const curves = ['sine', 'circle', 'spiral', 'lissajous', 'heart'] as const;
    const colors = [
      'rgba(103, 232, 249, 0.9)', // Cyan
      'rgba(255, 120, 203, 0.9)', // Pink
      'rgba(252, 211, 77, 0.9)',  // Yellow
      'rgba(139, 92, 246, 0.9)',  // Purple
      'rgba(96, 165, 250, 0.9)'   // Blue
    ];
    
    // Create multiple curves
    curves.forEach((curveType, curveIndex) => {
      const particleCount = curveType === 'spiral' ? 50 : 30;
      const color = colors[curveIndex % colors.length];
      
      for (let i = 0; i < particleCount; i++) {
        const t = i / particleCount;
        const point = getCurvePoint(t, centerX, centerY, width * 0.8, height * 0.6, curveType);
        
        // Add some randomness to initial positions
        const randomAngle = Math.random() * Math.PI * 2;
        const randomDistance = Math.random() * Math.max(width, height) * 0.5;
        const initialX = centerX + Math.cos(randomAngle) * randomDistance;
        const initialY = centerY + Math.sin(randomAngle) * randomDistance;
        
        particles.push({
          id: particles.length,
          x: initialX,
          y: initialY,
          targetX: point.x,
          targetY: point.y,
          size: 2 + Math.random() * 3,
          delay: 0.01 * particles.length + (curveIndex * 0.2),
          color: color
        });
      }
    });
    
    // Add particles for the message box formation (second phase)
    const boxParticlesCount = 80;
    const boxPoints = [];
    
    // Top edge
    for (let i = 0; i <= 20; i++) {
      boxPoints.push({
        x: boxLeft + (i/20) * boxWidth,
        y: boxTop
      });
    }
    
    // Right edge
    for (let i = 1; i <= 20; i++) {
      boxPoints.push({
        x: boxLeft + boxWidth,
        y: boxTop + (i/20) * boxHeight
      });
    }
    
    // Bottom edge
    for (let i = 1; i <= 20; i++) {
      boxPoints.push({
        x: boxLeft + boxWidth - (i/20) * boxWidth,
        y: boxTop + boxHeight
      });
    }
    
    // Left edge
    for (let i = 1; i < 20; i++) {
      boxPoints.push({
        x: boxLeft,
        y: boxTop + boxHeight - (i/20) * boxHeight
      });
    }
    
    // Add box particles
    for (let i = 0; i < boxParticlesCount; i++) {
      const pointIndex = i % boxPoints.length;
      const point = boxPoints[pointIndex];
      
      // Get a random point from the existing curves as initial position
      const randomIndex = Math.floor(Math.random() * particles.length);
      const randomPoint = randomIndex < particles.length 
        ? { x: particles[randomIndex].targetX, y: particles[randomIndex].targetY } 
        : { x: Math.random() * width, y: Math.random() * height };
      
      particles.push({
        id: 'box-' + i,
        x: randomPoint.x,
        y: randomPoint.y,
        targetX: point.x,
        targetY: point.y,
        size: 2 + Math.random() * 2,
        delay: 3 + 0.02 * i, // Delayed to form after the curves
        color: 'rgba(255, 255, 255, 0.9)',
        isBoxParticle: true
      });
    }
    
    return particles;
  };

  // Initialize particles
  const [particles, setParticles] = useState<any[]>([]);
  
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setParticles(generateParticles(clientWidth, clientHeight));
    }
    
    // Animation sequence
    const showMessageTimer = setTimeout(() => {
      setIsMessageVisible(true);
      // Hide the curve particles when showing the message
      setShowParticles(false);
    }, 4500);
    
    return () => {
      clearTimeout(showMessageTimer);
    };
  }, []);
  
  const handleContinue = () => {
    setIsForming(false);
    
    // Wait a bit before hiding the message
    setTimeout(() => {
      setIsMessageVisible(false);
    }, 100);
    
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
                  setShowParticles(true);
                  setIsMessageVisible(false);

                  // Regenerate particles for fresh animation
                  if (containerRef.current) {
                    const { clientWidth, clientHeight } = containerRef.current;
                    setParticles(generateParticles(clientWidth, clientHeight));
                  }

                  // Show message after delay
                  setTimeout(() => {
                    setIsMessageVisible(true);
                    setShowParticles(false);
                  }, 4500);
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
            <div className="absolute inset-0 bg-gray-900">
              {/* Curve Particles */}
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
                  color={particle.color || 'rgba(255, 255, 255, 0.8)'}
                  isVisible={particle.isBoxParticle ? true : showParticles}
                />
              ))}
              
              {/* Message box */}
              <AnimatePresence>
                {isMessageVisible && (
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-lg p-8 rounded-lg border border-white/20 text-white text-center w-4/5 max-w-md z-10"
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