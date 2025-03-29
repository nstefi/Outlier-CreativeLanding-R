import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// Particle for the dot
const Dot = ({
  x, y, size, color, opacity = 1, delay = 0
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity?: number;
  delay?: number;
}) => {
  // Basic spring animation for subtle movement
  const spring = {
    type: "spring",
    damping: 20,
    stiffness: 40,
    mass: 0.5
  };

  // Calculate a small random offset for natural movement
  const randomOffset = {
    x: Math.random() * 3 - 1.5,
    y: Math.random() * 3 - 1.5
  };

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size}px ${color}`,
        x: x - size / 2, // Center dot on coordinates
        y: y - size / 2,
        zIndex: 1,
      }}
      animate={{
        x: [x - size / 2, x - size / 2 + randomOffset.x, x - size / 2],
        y: [y - size / 2, y - size / 2 + randomOffset.y, y - size / 2],
        opacity: [opacity * 0.7, opacity, opacity * 0.8]
      }}
      transition={{
        x: { ...spring, delay },
        y: { ...spring, delay },
        opacity: { duration: 2, repeat: Infinity, repeatType: "reverse" }
      }}
    />
  );
};

// Line component made up of dots
const DotLine = ({
  startPoint,
  endPoint,
  dotCount,
  dotSize,
  dotColor,
  waveFactor = 0,
  waveSpeed = 1,
  waveHeight = 0,
  lineDelay = 0,
  isVertical = false
}: {
  startPoint: { x: number, y: number };
  endPoint: { x: number, y: number };
  dotCount: number;
  dotSize: number;
  dotColor: string;
  waveFactor?: number;
  waveSpeed?: number;
  waveHeight?: number;
  lineDelay?: number;
  isVertical?: boolean;
}) => {
  const [time, setTime] = useState(0);
  const animationRef = useRef<number>();

  // Calculate positions with wave effect
  const calculatePositions = () => {
    const positions = [];
    
    // Animation time factor
    const now = time * waveSpeed;
    
    for (let i = 0; i < dotCount; i++) {
      const t = i / (dotCount - 1);
      
      // Base interpolation between start and end
      let x = startPoint.x + t * (endPoint.x - startPoint.x);
      let y = startPoint.y + t * (endPoint.y - startPoint.y);
      
      // Apply wave effect
      if (waveFactor > 0) {
        // Different wave patterns depending on if line is more horizontal or vertical
        if (isVertical) {
          x += Math.sin(t * Math.PI * waveFactor + now) * waveHeight;
        } else {
          y += Math.sin(t * Math.PI * waveFactor + now) * waveHeight;
        }
      }
      
      // Calculate dot opacity based on position (fades at edges)
      const edgeFade = 0.2;
      const edgeT = t < 0.5 ? t * 2 : (1 - t) * 2;
      const opacity = Math.min(1, edgeFade + edgeT * (1 - edgeFade));
      
      // Calculate dot size variation (larger in center)
      const sizeVariation = 0.7 + Math.sin(t * Math.PI) * 0.3;
      
      positions.push({
        x,
        y,
        opacity,
        size: dotSize * sizeVariation
      });
    }
    
    return positions;
  };

  // Animate dots
  useEffect(() => {
    const updateTime = () => {
      setTime(prev => prev + 0.01);
      animationRef.current = requestAnimationFrame(updateTime);
    };
    
    animationRef.current = requestAnimationFrame(updateTime);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Render dots
  const dotPositions = calculatePositions();
  
  return (
    <>
      {dotPositions.map((pos, index) => (
        <Dot
          key={`line-${startPoint.x}-${startPoint.y}-${index}`}
          x={pos.x}
          y={pos.y}
          size={pos.size}
          color={dotColor}
          opacity={pos.opacity}
          delay={lineDelay + index * 0.01}
        />
      ))}
    </>
  );
};

// Grid of lines for background
const BackgroundGrid = ({
  width,
  height,
  linesX = 8,
  linesY = 6,
  dotDensity = 15,
  dotSize = 4
}: {
  width: number;
  height: number;
  linesX?: number;
  linesY?: number;
  dotDensity?: number;
  dotSize?: number;
}) => {
  // Array of colors for different lines
  const colors = [
    '#61DAFB', // Cyan
    '#FFC107', // Gold
    '#E0E0E0', // Silver
    '#9C27B0', // Purple
    '#2196F3'  // Blue
  ];
  
  // Generate horizontal lines
  const horizontalLines = Array.from({ length: linesY }).map((_, i) => {
    const y = height * 0.1 + (height * 0.8) * (i / (linesY - 1));
    const color = colors[i % colors.length];
    
    // Each line has unique wave properties
    const waveFactor = 1 + (i % 3);
    const waveSpeed = 0.3 + (i % 4) * 0.2;
    const waveHeight = 20 + (i % 5) * 10;
    
    return (
      <DotLine
        key={`h-line-${i}`}
        startPoint={{ x: width * 0.1, y }}
        endPoint={{ x: width * 0.9, y }}
        dotCount={dotDensity + (i % 3) * 5}
        dotSize={dotSize}
        dotColor={color}
        waveFactor={waveFactor}
        waveSpeed={waveSpeed}
        waveHeight={waveHeight}
        lineDelay={i * 0.1}
      />
    );
  });
  
  // Generate vertical lines
  const verticalLines = Array.from({ length: linesX }).map((_, i) => {
    const x = width * 0.1 + (width * 0.8) * (i / (linesX - 1));
    const color = colors[(i + 2) % colors.length];
    
    // Each line has unique wave properties
    const waveFactor = 1 + (i % 3);
    const waveSpeed = 0.4 + (i % 3) * 0.2;
    const waveHeight = 15 + (i % 4) * 10;
    
    return (
      <DotLine
        key={`v-line-${i}`}
        startPoint={{ x, y: height * 0.1 }}
        endPoint={{ x, y: height * 0.9 }}
        dotCount={dotDensity + (i % 4) * 3}
        dotSize={dotSize}
        dotColor={color}
        waveFactor={waveFactor}
        waveSpeed={waveSpeed}
        waveHeight={waveHeight}
        lineDelay={i * 0.1}
        isVertical
      />
    );
  });
  
  // Generate diagonal lines for more interest
  const diagonalLines = Array.from({ length: 5 }).map((_, i) => {
    const startX = width * (0.2 + (i * 0.15));
    const startY = height * 0.1;
    const endX = startX + width * 0.2;
    const endY = height * 0.9;
    const color = colors[(i + 3) % colors.length];
    
    return (
      <DotLine
        key={`d-line-${i}`}
        startPoint={{ x: startX, y: startY }}
        endPoint={{ x: endX, y: endY }}
        dotCount={dotDensity + 10}
        dotSize={dotSize * 1.2}
        dotColor={color}
        waveFactor={2}
        waveSpeed={0.5}
        waveHeight={30}
        lineDelay={i * 0.2}
      />
    );
  });
  
  return (
    <>
      {horizontalLines}
      {verticalLines}
      {diagonalLines}
    </>
  );
};

// Flowing curved paths of dots
const FlowingPath = ({
  width,
  height,
  dotSize = 5,
  dotCount = 40,
  color = '#61DAFB',
  speed = 1,
  amplitude = 100,
  frequency = 2,
  pathDelay = 0
}: {
  width: number;
  height: number;
  dotSize?: number;
  dotCount?: number;
  color?: string;
  speed?: number;
  amplitude?: number;
  frequency?: number;
  pathDelay?: number;
}) => {
  const [time, setTime] = useState(0);
  const animationRef = useRef<number>();
  
  // Animation loop
  useEffect(() => {
    const updateTime = () => {
      setTime(prev => prev + 0.01 * speed);
      animationRef.current = requestAnimationFrame(updateTime);
    };
    
    animationRef.current = requestAnimationFrame(updateTime);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed]);
  
  // Calculate positions along flowing path
  const calculatePathPositions = () => {
    const positions = [];
    const centerX = width / 2;
    const centerY = height / 2;
    
    for (let i = 0; i < dotCount; i++) {
      const t = i / dotCount;
      const angle = t * Math.PI * 2 * frequency + time;
      
      // Parametric curve equations for flowing path
      const x = centerX + Math.cos(angle) * amplitude * Math.sin(t * Math.PI + time * 0.5);
      const y = centerY + Math.sin(angle) * amplitude * Math.cos(t * Math.PI * 2 + time);
      
      // Vary dot size based on position
      const sizeVariation = 0.7 + 0.5 * Math.sin(t * Math.PI * 4 + time);
      
      positions.push({
        x,
        y,
        size: dotSize * sizeVariation
      });
    }
    
    return positions;
  };
  
  const pathPositions = calculatePathPositions();
  
  return (
    <>
      {pathPositions.map((pos, index) => (
        <Dot
          key={`flow-${color}-${index}`}
          x={pos.x}
          y={pos.y}
          size={pos.size}
          color={color}
          delay={pathDelay + index * 0.01}
        />
      ))}
    </>
  );
};

// Main component
export default function ConferenceBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header with back button */}
      <header className="bg-black py-4 px-6 z-10">
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
      
      {/* Animation container */}
      <div className="flex-1 relative overflow-hidden bg-black" ref={containerRef}>
        {/* Only render animation once dimensions are available */}
        {dimensions.width > 0 && dimensions.height > 0 && (
          <>
            {/* Grid of wavy lines */}
            <BackgroundGrid
              width={dimensions.width}
              height={dimensions.height}
              linesX={6}
              linesY={5}
              dotDensity={25}
              dotSize={6}
            />
            
            {/* Flowing curved paths */}
            <FlowingPath
              width={dimensions.width}
              height={dimensions.height}
              dotSize={7}
              dotCount={40}
              color="#FFC107"
              speed={1.2}
              amplitude={Math.min(dimensions.width, dimensions.height) * 0.3}
              frequency={3}
              pathDelay={0}
            />
            
            <FlowingPath
              width={dimensions.width}
              height={dimensions.height}
              dotSize={8}
              dotCount={30}
              color="#E0E0E0"
              speed={0.8}
              amplitude={Math.min(dimensions.width, dimensions.height) * 0.25}
              frequency={2}
              pathDelay={0.5}
            />
            
            <FlowingPath
              width={dimensions.width}
              height={dimensions.height}
              dotSize={6}
              dotCount={35}
              color="#61DAFB"
              speed={1.5}
              amplitude={Math.min(dimensions.width, dimensions.height) * 0.35}
              frequency={1.5}
              pathDelay={1}
            />
          </>
        )}
      </div>
    </div>
  );
}