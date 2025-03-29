import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// Particle component
const Particle = ({ 
  x, y, targetX, targetY, size, delay, isForming, color
}: { 
  x: number; 
  y: number; 
  targetX: number; 
  targetY: number; 
  size: number; 
  delay: number; 
  isForming: boolean;
  color: string;
}) => {
  // For motion
  const spring = {
    type: "spring",
    damping: 20,
    stiffness: 40,
    mass: 0.8
  };

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: 0,
        top: 0,
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        zIndex: 50,
        // Center the dot on its coordinates
        translateX: -size / 2,
        translateY: -size / 2,
      }}
      initial={{ 
        x, 
        y,
        opacity: 0
      }}
      animate={{ 
        x: isForming ? targetX : x + (Math.random() - 0.5) * 400,
        y: isForming ? targetY : y + (Math.random() - 0.5) * 400,
        opacity: 1,
        scale: isForming ? 1 : 0
      }}
      transition={{
        x: { ...spring, delay },
        y: { ...spring, delay },
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.8, delay: isForming ? delay : delay + 0.2 }
      }}
    />
  );
};

// Define particle type
type ParticleType = {
  id: string | number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  delay: number;
  color: string;
};

// Main component
export default function ParticleDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const [particles, setParticles] = useState<ParticleType[]>([]);
  // Animation settings
  const [isForming, setIsForming] = useState(true); // true = form fixed shapes, false = keep flowing
  
  // Animation frame reference
  const animationRef = useRef<number>();
  
  // Helper function to generate a point on a parametric curve
  const getCurvePoint = (
    t: number, 
    centerX: number, 
    centerY: number, 
    width: number, 
    height: number, 
    curve: 'flux' | 'vortex' | 'spiral3d',
    offset: number = 0, // For parallel curves
    time: number = 0    // For rotation animation
  ) => {
    // Time-based rotation factors
    const rotationX = Math.cos(time) * Math.PI;
    const rotationY = Math.sin(time) * Math.PI / 2;
    const rotationZ = time;
    
    // Continuous time-based rotation (for flowing animation)
    const flowTime = Date.now() / 1000;
    
    // Helper function to apply 3D rotation to a point
    const rotate3D = (pointX: number, pointY: number, pointZ: number) => {
      // Rotate around X axis
      let y1 = pointY * Math.cos(rotationX) - pointZ * Math.sin(rotationX);
      let z1 = pointY * Math.sin(rotationX) + pointZ * Math.cos(rotationX);
      pointY = y1;
      pointZ = z1;
      
      // Rotate around Y axis
      let x1 = pointX * Math.cos(rotationY) + pointZ * Math.sin(rotationY);
      z1 = -pointX * Math.sin(rotationY) + pointZ * Math.cos(rotationY);
      pointX = x1;
      pointZ = z1;
      
      // Rotate around Z axis
      x1 = pointX * Math.cos(rotationZ) - pointY * Math.sin(rotationZ);
      y1 = pointX * Math.sin(rotationZ) + pointY * Math.cos(rotationZ);
      pointX = x1;
      pointY = y1;
      
      // Calculate scale based on z value (perspective)
      const scale = 400 / (400 + pointZ);
      
      return {
        x: centerX + pointX * scale,
        y: centerY + pointY * scale
      };
    };
    
    switch(curve) {
      case 'flux':
        // Flowing tube-like structure inspired by the reference images
        const fluxR = Math.min(width, height) * 0.3;
        const tubeLayers = 15; // Number of concentric layers
        
        // Use offset to create different layers
        const layerIndex = offset % tubeLayers;
        const layerRadius = fluxR * (0.2 + 0.8 * (layerIndex / tubeLayers));
        
        // Create twisting flow with sine waves
        const fluxPhase = flowTime * 0.5; // Continuous rotation
        const twirlFactor = 3 + Math.sin(flowTime * 0.2) * 2; // Varying twist
        const waveAmplitude = 0.15 + 0.1 * Math.sin(flowTime * 0.3);
        
        // Base rotation around circle
        const baseAngle = t * Math.PI * 2 * twirlFactor + fluxPhase;
        
        // Add wave distortion for each layer
        const waveOffset = Math.sin(baseAngle * 2 + layerIndex) * waveAmplitude;
        const radiusWithWave = layerRadius * (1 + waveOffset);
        
        // Flow direction varies with time
        const flowZ = Math.cos(t * Math.PI * 4 + fluxPhase + layerIndex * 0.2) * height * 0.4;
        
        // Calculate final position
        const fluxX = radiusWithWave * Math.cos(baseAngle);
        const fluxY = radiusWithWave * Math.sin(baseAngle);
        const fluxZ = flowZ;
        
        return rotate3D(fluxX, fluxY, fluxZ);
        
      case 'vortex':
        // Vortex/tunnel effect (like the second image)
        const vortexWidth = Math.min(width, height) * 0.35;
        const vortexDepth = height * 0.6;
        
        // Use t for position along the vortex
        // Use offset for angular position around the vortex
        const vortexAngle = (offset / 20) * Math.PI * 2;
        
        // Create spiral motion
        const spiralFactor = 1.5 + Math.sin(flowTime * 0.2) * 0.5; // Varying spiral tightness
        const spiralTwist = t * spiralFactor * Math.PI * 2;
        
        // Radius decreases as we go deeper into the vortex for tunnel effect
        const vortexRadius = vortexWidth * (0.2 + 0.8 * (1 - t));
        
        // Calculate position with some wobble
        const wobble = Math.sin(t * Math.PI * 8 + flowTime) * 0.1;
        const vortexX = vortexRadius * (1 + wobble) * Math.cos(vortexAngle + spiralTwist);
        const vortexY = vortexRadius * (1 + wobble) * Math.sin(vortexAngle + spiralTwist);
        const vortexZ = -vortexDepth * t; // Negative to go into the screen
        
        return rotate3D(vortexX, vortexY, vortexZ);
      
      case 'spiral3d':
        // 3D spiral with wave effects (like the third image)
        const spiralBaseRadius = Math.min(width, height) * 0.3;
        const spiralDepth = height * 0.8;
        
        // Spiral parameters
        const spiralRevolutions = 2 + Math.sin(flowTime * 0.3) * 0.5;
        const spiralAngle = t * Math.PI * 2 * spiralRevolutions;
        
        // Use offset to create parallel spirals
        const spiralOffset = (offset / 15) * Math.PI * 2;
        
        // Create wave-like distortions along the spiral
        const wavePhase = flowTime * 0.5;
        const radiusWave = Math.sin(t * Math.PI * 6 + wavePhase + offset * 0.2) * 0.2;
        const heightWave = Math.cos(t * Math.PI * 8 + wavePhase) * 0.15;
        
        // Calculate spiral position with waves
        const spiralR = spiralBaseRadius * (0.3 + 0.7 * t) * (1 + radiusWave);
        const spiralX = spiralR * Math.cos(spiralAngle + spiralOffset);
        const spiralY = spiralR * Math.sin(spiralAngle + spiralOffset);
        const spiralZ = (-spiralDepth * 0.5) + spiralDepth * t * (1 + heightWave);
        
        return rotate3D(spiralX, spiralY, spiralZ);
      
      default:
        return { x: centerX, y: centerY };
    }
  };

  // Generate particles along curves
  const generateParticles = (width: number, height: number) => {
    const particles: ParticleType[] = [];
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Parameters for curves - using the new flowing patterns
    const curves = ['flux', 'vortex', 'spiral3d'] as const;
    const colors = [
      'rgba(103, 232, 249, 0.9)', // Cyan
      'rgba(255, 215, 77, 0.9)',  // Gold (like in the reference)
      'rgba(230, 230, 230, 0.9)', // Silver (like in the reference)
      'rgba(139, 92, 246, 0.9)',  // Purple
      'rgba(96, 165, 250, 0.9)'   // Blue
    ];
    
    // Animation time value
    const time = Math.random() * Math.PI; // Random starting phase
    
    // Create multiple 3D curves with parallel lines
    curves.forEach((curveType, curveIndex) => {
      const particleCount = 60; // More particles for dense effect
      const color = colors[curveIndex % colors.length];
      const parallels = 20; // More parallel lines for complex patterns
      
      // For each parallel line
      for (let p = 0; p < parallels; p++) {
        // For each point on the curve
        for (let i = 0; i < particleCount; i++) {
          const t = i / particleCount;
          
          // Create the point with offset and time for rotation
          const point = getCurvePoint(
            t, 
            centerX, 
            centerY, 
            width * 0.8, 
            height * 0.6, 
            curveType,
            p,    // Offset for parallel curves
            time  // Time value for rotation
          );
          
          // Add some randomness to initial positions
          const randomAngle = Math.random() * Math.PI * 2;
          const randomDistance = Math.random() * Math.max(width, height) * 0.5;
          const initialX = centerX + Math.cos(randomAngle) * randomDistance;
          const initialY = centerY + Math.sin(randomAngle) * randomDistance;
          
          particles.push({
            id: `${curveType}-${p}-${i}`,
            x: initialX,
            y: initialY,
            targetX: point.x,
            targetY: point.y,
            size: 1.0 + Math.random() * 1.5, // Smaller particles for more refined look
            delay: 0.005 * particles.length + (curveIndex * 0.1) + (p * 0.01), // Faster formation
            color: color
          });
        }
      }
    });
    
    return particles;
  };
  
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      // Generate initial particles
      setParticles(generateParticles(clientWidth, clientHeight));
      
      // Start continuous animation
      let startTime = Date.now();
      
      // Function to update particle positions based on animation time
      const updateParticles = () => {
        const currentTime = Date.now();
        const elapsed = (currentTime - startTime) / 1000;
        
        if (containerRef.current) {
          const { clientWidth, clientHeight } = containerRef.current;
          
          // Update particles every 5 seconds for fluid motion
          if (elapsed > 5) {
            startTime = currentTime;
            setParticles(generateParticles(clientWidth, clientHeight));
          }
        }
        
        // Continue animation loop
        animationRef.current = requestAnimationFrame(updateParticles);
      };
      
      // Start animation loop
      animationRef.current = requestAnimationFrame(updateParticles);
    }
    
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
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
      
      {/* Main content - just the animation, no message box */}
      <div className="flex-1 relative overflow-hidden" ref={containerRef}>
        {/* Black background with subtle gradient */}
        <div className="absolute inset-0 bg-black">
          {/* Radial gradient background for depth */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.3) 0%, rgba(0, 0, 0, 1) 70%)',
            }}
          />
          
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
              color={particle.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}