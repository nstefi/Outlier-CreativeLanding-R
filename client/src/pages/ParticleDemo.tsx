import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// Single dot component
const Dot = ({ 
  x, 
  y, 
  size, 
  color, 
  opacity = 1 
}: { 
  x: number; 
  y: number; 
  size: number; 
  color: string; 
  opacity?: number; 
}) => {
  return (
    <div 
      className="absolute rounded-full" 
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        opacity: opacity,
        transform: `translate(${x - size / 2}px, ${y - size / 2}px)`,
        boxShadow: `0 0 ${size / 2}px ${color}80`
      }}
    />
  );
};

// Generate a single wavy line of dots
const WavyLine = ({
  startX,
  startY,
  width,
  dotCount = 50,
  dotSize = 3,
  color = '#3cefff',
  amplitude = 50,
  frequency = 0.02,
  speed = 1,
  phase = 0
}: {
  startX: number;
  startY: number;
  width: number;
  dotCount?: number;
  dotSize?: number;
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  phase?: number;
}) => {
  const [time, setTime] = useState(0);
  const animationRef = useRef<number>();

  // Update animation time
  useEffect(() => {
    const animate = () => {
      setTime(prev => prev + 0.01 * speed);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed]);

  // Calculate positions of dots
  const dots = [];
  const spacing = width / (dotCount - 1);

  for (let i = 0; i < dotCount; i++) {
    const x = startX + i * spacing;
    
    // Different wave equations for more variation and natural feel
    const waveFactor = Math.sin(frequency * x + time + phase);
    
    // Calculate y position with sine wave
    const y = startY + amplitude * waveFactor;
    
    // Vary dot size and opacity for more natural feel
    const dotOpacity = 0.4 + 0.6 * Math.abs(waveFactor);
    
    // Slightly vary dot size with position in wave
    const sizeFactor = 0.8 + 0.4 * Math.abs(waveFactor);
    
    dots.push(
      <Dot 
        key={`line-${startX}-${startY}-${i}`}
        x={x} 
        y={y} 
        size={dotSize * sizeFactor} 
        color={color} 
        opacity={dotOpacity}
      />
    );
  }

  return <>{dots}</>;
};

// Group of multiple wavy lines
const WavyLineGroup = ({
  width,
  height,
  lineCount = 6,
  colorScheme = 'teal'
}: {
  width: number;
  height: number;
  lineCount?: number;
  colorScheme?: 'teal' | 'green' | 'blue' | 'purple';
}) => {
  // Color schemes
  const colorSchemes = {
    teal: ['#01feff', '#3cefff', '#93fcff', '#a3fffd'],
    green: ['#00ff87', '#38ef7d', '#70f570', '#42f595'],
    blue: ['#0061ff', '#60a5fa', '#93c5fd', '#4f8df5'],
    purple: ['#bf00ff', '#a855f7', '#c084fc', '#d8b4fe']
  };

  const colors = colorSchemes[colorScheme];
  const lines = [];

  for (let i = 0; i < lineCount; i++) {
    // Space lines evenly across height
    const yPos = (height / (lineCount + 1)) * (i + 1);
    
    // Alternate phases and frequencies for varied movement
    const phase = i * Math.PI / (lineCount / 2);
    const frequency = 0.01 + (i % 3) * 0.005;
    const amplitude = 30 + (i % 4) * 15;
    const speed = 0.8 + (i % 5) * 0.2;
    
    // Alternate direction for some lines
    const startX = i % 2 === 0 ? 0 : width;
    const lineWidth = width;
    
    // Use different colors from our scheme
    const color = colors[i % colors.length];
    
    // Vary dot count slightly for each line
    const dotCount = 50 + (i % 3) * 10;
    
    // Vary dot size
    const dotSize = 2 + (i % 3);
    
    lines.push(
      <WavyLine 
        key={`wavyline-${i}`}
        startX={startX} 
        startY={yPos} 
        width={lineWidth} 
        dotCount={dotCount}
        dotSize={dotSize}
        color={color}
        amplitude={amplitude}
        frequency={frequency}
        speed={speed}
        phase={phase}
      />
    );
  }

  return <>{lines}</>;
};

// Curved wavy line that creates more complex paths
const CurvedWavyLine = ({
  width,
  height,
  dotCount = 100,
  dotSize = 2.5,
  color = '#3cefff',
  amplitude = 40,
  frequency = 3,
  speed = 1,
  curvature = 1,
  verticalShift = 0
}: {
  width: number;
  height: number;
  dotCount?: number;
  dotSize?: number;
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  curvature?: number;
  verticalShift?: number;
}) => {
  const [time, setTime] = useState(0);
  const animationRef = useRef<number>();

  // Update animation time
  useEffect(() => {
    const animate = () => {
      setTime(prev => prev + 0.005 * speed);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed]);

  // Calculate positions of dots in a curved path
  const dots = [];
  
  for (let i = 0; i < dotCount; i++) {
    const t = i / dotCount;
    const angle = t * Math.PI * 2 * frequency + time;
    
    // Parametric equations for curved path
    const x = width * (0.1 + 0.8 * t);
    
    // Calculate y position with sine wave and parabolic curve
    const baseline = height * 0.5 + verticalShift;
    const curveOffset = curvature * Math.sin(t * Math.PI);
    const waveOffset = amplitude * Math.sin(angle);
    
    const y = baseline + curveOffset * height * 0.3 + waveOffset;
    
    // Vary dot opacity with position
    const dotOpacity = 0.4 + 0.6 * Math.abs(Math.sin(angle));
    
    // Vary dot size with position
    const sizeFactor = 0.7 + 0.3 * Math.abs(Math.sin(angle));
    
    dots.push(
      <Dot 
        key={`curved-${i}`}
        x={x} 
        y={y} 
        size={dotSize * sizeFactor} 
        color={color} 
        opacity={dotOpacity}
      />
    );
  }

  return <>{dots}</>;
};

export default function ParticleDemo() {
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
    <div className="min-h-screen bg-black flex flex-col">
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
        {dimensions.width > 0 && dimensions.height > 0 && (
          <>
            {/* Regular wavy lines */}
            <WavyLineGroup 
              width={dimensions.width} 
              height={dimensions.height} 
              lineCount={8}
              colorScheme="teal"
            />
            
            {/* Curved wavy paths */}
            <CurvedWavyLine 
              width={dimensions.width}
              height={dimensions.height}
              dotCount={100}
              dotSize={3}
              color="#01feff"
              amplitude={50}
              frequency={2}
              speed={0.8}
              curvature={0.5}
              verticalShift={-100}
            />
            
            <CurvedWavyLine 
              width={dimensions.width}
              height={dimensions.height}
              dotCount={120}
              dotSize={2.5}
              color="#38ef7d"
              amplitude={40}
              frequency={3}
              speed={1.2}
              curvature={-0.7}
              verticalShift={100}
            />
          </>
        )}
      </div>
    </div>
  );
}