const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Animation parameters
const particles = [];
const numParticles = 200;  // More particles
const branchingFactor = 6;  // More connections
let time = 0;
let expansionPhase = 0;  // Track overall expansion/contraction

// Create particles with branching connections
for (let i = 0; i < numParticles; i++) {
    const angle = (i / numParticles) * Math.PI * 2;
    const radius = 200 + Math.random() * 100;  // Larger initial radius
    
    particles.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle: angle,
        speed: 0.5 + Math.random() * 0.5,
        radius: radius,
        connections: [],
        phase: Math.random() * Math.PI * 2,
        oscillationSpeed: 0.01 + Math.random() * 0.01,  // Slower oscillation
        shapeOffset: Math.random() * Math.PI * 2,  // For shape variation
        expansionRate: 0.8 + Math.random() * 0.4   // Individual expansion rate
    });
}

// Create connections between particles
particles.forEach((particle, i) => {
    for (let j = 1; j <= branchingFactor; j++) {
        const targetIndex = (i + j * 3) % numParticles;  // More spread out connections
        particle.connections.push(targetIndex);
    }
});

function drawParticle(x, y, size, opacity) {
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate global expansion factor
    expansionPhase += 0.002;
    const globalExpansion = Math.sin(expansionPhase) * 0.5 + 1.5;  // Range: 1.0 to 2.0
    
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
        particle.connections.forEach(targetIndex => {
            const target = particles[targetIndex];
            const dx = target.currentX - x;
            const dy = target.currentY - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 400;  // Longer connection distance

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
    if (Math.random() < 0.08) {  // More frequent branches
        const sourceIndex = Math.floor(Math.random() * numParticles);
        const source = particles[sourceIndex];
        
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.2)';
        ctx.lineWidth = 1;
        
        const numBranches = Math.floor(3 + Math.random() * 4);  // Variable number of branches
        for (let i = 0; i < numBranches; i++) {
            const angle = Math.random() * Math.PI * 2;
            const length = (50 + Math.random() * 100) * globalExpansion;  // Longer branches
            
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

animate(); 