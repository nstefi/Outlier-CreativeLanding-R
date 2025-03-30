import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

export default function SplashScreen() {
  const [, setLocation] = useLocation();
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const splashScreenRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Initialize animation 
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    function resizeCanvas() {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation parameters
    const particles: any[] = [];
    const numParticles = 200;
    const branchingFactor = 6;
    let time = 0;
    let expansionPhase = 0;

    // Create particles with branching connections
    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2;
      const radius = 200 + Math.random() * 100;
      
      particles.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle: angle,
        speed: 0.5 + Math.random() * 0.5,
        radius: radius,
        connections: [],
        phase: Math.random() * Math.PI * 2,
        oscillationSpeed: 0.01 + Math.random() * 0.01,
        shapeOffset: Math.random() * Math.PI * 2,
        expansionRate: 0.8 + Math.random() * 0.4
      });
    }

    // Create connections between particles
    particles.forEach((particle, i) => {
      for (let j = 1; j <= branchingFactor; j++) {
        const targetIndex = (i + j * 3) % numParticles;
        particle.connections.push(targetIndex);
      }
    });

    function drawParticle(x: number, y: number, size: number, opacity: number) {
      if (!ctx) return;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, `rgba(0, 200, 255, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(0, 100, 255, ${opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(0, 0, 255, 0)');

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Animation function
    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Calculate global expansion factor
      expansionPhase += 0.002;
      const globalExpansion = Math.sin(expansionPhase) * 0.5 + 1.5;
      
      // Update and draw particles
      particles.forEach((particle, i) => {
        // Calculate particle position with various oscillations
        const timeScale = time * particle.oscillationSpeed;
        
        // Complex radius calculation with multiple waves
        const baseRadius = particle.radius * globalExpansion;
        const radiusOscillation = Math.sin(timeScale + particle.phase) * 100;
        const shapeDistortion = Math.sin(particle.angle * 3 + timeScale * 0.2 + particle.shapeOffset) * 50;
        
        // Angle variations
        const angleOscillation = Math.cos(timeScale * 0.3) * 0.3;
        const shapeAngleEffect = Math.sin(particle.angle * 2 + timeScale * 0.1) * 0.2;
        
        // Combine all effects
        const currentAngle = particle.angle + angleOscillation + shapeAngleEffect;
        const currentRadius = (baseRadius + radiusOscillation + shapeDistortion) * particle.expansionRate;

        // Calculate final position
        const x = Math.cos(currentAngle) * currentRadius + centerX;
        const y = Math.sin(currentAngle) * currentRadius + centerY;

        // Store updated position
        particle.currentX = x;
        particle.currentY = y;

        // Draw connections with varying opacity
        particle.connections.forEach((targetIndex: number) => {
          const target = particles[targetIndex];
          const dx = target.currentX - x;
          const dy = target.currentY - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 400;

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.4;
            
            // Draw connection line with gradient
            const gradient = ctx.createLinearGradient(x, y, target.currentX, target.currentY);
            gradient.addColorStop(0, `rgba(0, 150, 255, ${opacity})`);
            gradient.addColorStop(1, `rgba(0, 50, 255, ${opacity * 0.5})`);

            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.moveTo(x, y);
            ctx.lineTo(target.currentX, target.currentY);
            ctx.stroke();
          }
        });

        // Draw particle with size variation based on expansion
        const particleSize = (2 + Math.sin(timeScale + particle.phase) * 1) * globalExpansion;
        drawParticle(x, y, particleSize, 0.7);
      });

      // Create occasional branching effects
      if (Math.random() < 0.08) {
        const sourceIndex = Math.floor(Math.random() * numParticles);
        const source = particles[sourceIndex];
        
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.2)';
        ctx.lineWidth = 1;
        
        const numBranches = Math.floor(3 + Math.random() * 4);
        for (let i = 0; i < numBranches; i++) {
          const angle = Math.random() * Math.PI * 2;
          const length = (50 + Math.random() * 100) * globalExpansion;
          
          ctx.moveTo(source.currentX, source.currentY);
          ctx.lineTo(
            source.currentX + Math.cos(angle) * length,
            source.currentY + Math.sin(angle) * length
          );
        }
        ctx.stroke();
      }

      time++;
      requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Handle explore button click
  const handleExplore = () => {
    if (splashScreenRef.current) {
      splashScreenRef.current.classList.add('exit');
    }
    
    // Navigate to main site after animation
    setTimeout(() => {
      setLocation('/');
    }, 1000);
  };

  return (
    <>
      <div 
        ref={splashScreenRef}
        className="splash-screen"
      >
        <canvas ref={waveCanvasRef} id="waveCanvas"></canvas>
        <main className="content">
          <h1 className="title">
            <span className="title-line">Bringing Your Ideas</span>
            <span className="title-line">to Life with</span>
            <span className="title-line highlight">Animation</span>
          </h1>
          <button 
            className="explore-btn"
            onClick={handleExplore}
          >
            <span className="btn-text">Explore</span>
            <span className="btn-icon">→</span>
          </button>
        </main>
      </div>
    </>
  );
}