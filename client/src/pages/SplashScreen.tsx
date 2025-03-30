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
    // Create explosion particles
    const createExplosionEffect = () => {
      const explosionContainer = document.createElement('div');
      explosionContainer.className = 'particle-explosion';
      document.body.appendChild(explosionContainer);
      
      // Create particles that move outward from center
      for (let i = 0; i < 150; i++) {
        const particle = document.createElement('div');
        const size = 2 + Math.random() * 8;
        
        // Position particles more centered around text for a focused explosion
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const variance = Math.min(window.innerWidth, window.innerHeight) * 0.2;
        
        const x = centerX + (Math.random() - 0.5) * variance;
        const y = centerY + (Math.random() - 0.5) * variance;
        
        // Calculate angle from center
        const dx = x - centerX;
        const dy = y - centerY;
        const angle = Math.atan2(dy, dx);
        
        // Distance to travel in explosion
        const distance = 100 + Math.random() * 300;
        const duration = 700 + Math.random() * 700;
        
        // Different colors for variety
        const hue = 180 + Math.random() * 40; // blue to cyan range
        const brightness = 70 + Math.random() * 30;
        
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = `hsl(${hue}, 100%, ${brightness}%)`;
        particle.style.boxShadow = `0 0 ${size * 2}px ${size}px hsla(${hue}, 100%, ${brightness}%, 0.8)`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = '1';
        particle.style.zIndex = '1002';
        
        // Different timing functions for variety
        const timings = [
          'cubic-bezier(0.22, 1, 0.36, 1)',
          'cubic-bezier(0, 0.9, 0.1, 1)',
          'cubic-bezier(0.1, 0.8, 0.2, 1)'
        ];
        const timing = timings[Math.floor(Math.random() * timings.length)];
        
        // Set animation
        particle.style.animation = `explode ${duration}ms ${timing} forwards`;
        particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.1)`;
        
        explosionContainer.appendChild(particle);
      }
      
      // Create additional sparkle effects
      for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const radius = Math.min(window.innerWidth, window.innerHeight) * 0.4;
        const angle = Math.random() * Math.PI * 2;
        
        const x = centerX + Math.cos(angle) * radius * Math.random();
        const y = centerY + Math.sin(angle) * radius * Math.random();
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.animationDuration = `${300 + Math.random() * 700}ms`;
        sparkle.style.animationDelay = `${Math.random() * 500}ms`;
        
        explosionContainer.appendChild(sparkle);
      }
      
      // Remove particles after animation
      setTimeout(() => {
        if (explosionContainer && explosionContainer.parentNode) {
          explosionContainer.parentNode.removeChild(explosionContainer);
        }
      }, 2000);
    };
    
    // Trigger the effect and exit animation
    createExplosionEffect();
    
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