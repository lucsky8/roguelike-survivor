// particle-background.js
// A reusable particle system for game backgrounds

export class ParticleBackground {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      
      // Default options
      this.options = {
        particleCount: options.particleCount || 100,
        particleColor: options.particleColor || 'rgba(150, 50, 200, 0.2)',
        particleSize: options.particleSize || { min: 1, max: 4 },
        particleSpeed: options.particleSpeed || { min: 0.1, max: 0.4 },
        connectParticles: options.connectParticles !== undefined ? options.connectParticles : true,
        connectionDistance: options.connectionDistance || 120,
        connectionColor: options.connectionColor || 'rgba(150, 50, 200, 0.1)'
      };
      
      this.particles = [];
      this.animationFrame = null;
      this.initialize();
    }
    
    initialize() {
      // Clear any existing particles
      this.particles = [];
      
      // Create particles
      for (let i = 0; i < this.options.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: this.options.particleSize.min + Math.random() * (this.options.particleSize.max - this.options.particleSize.min),
          speed: this.options.particleSpeed.min + Math.random() * (this.options.particleSpeed.max - this.options.particleSpeed.min),
          direction: Math.random() * Math.PI * 2,
          opacity: 0.1 + Math.random() * 0.5,
          pulse: Math.random() * 0.1
        });
      }
    }
    
    update() {
      const time = Date.now() * 0.001;
      
      this.particles.forEach(particle => {
        // Move particle
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;
        
        // Pulsing effect
        particle.opacity = 0.1 + Math.abs(Math.sin(time + particle.pulse)) * 0.5;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
        
        // Slowly change direction
        particle.direction += (Math.random() - 0.5) * 0.05;
      });
    }
    
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw background gradient
      const bgGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      bgGradient.addColorStop(0, '#0a0a1a');
      bgGradient.addColorStop(1, '#1a0a2e');
      this.ctx.fillStyle = bgGradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw grid lines
      this.ctx.strokeStyle = 'rgba(100, 50, 150, 0.1)';
      this.ctx.lineWidth = 1;
      
      // Horizontal grid lines
      for (let y = 0; y < this.canvas.height; y += 40) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.canvas.width, y);
        this.ctx.stroke();
      }
      
      // Vertical grid lines
      for (let x = 0; x < this.canvas.width; x += 40) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.stroke();
      }
      
      // Connect particles if option is enabled
      if (this.options.connectParticles) {
        for (let i = 0; i < this.particles.length; i++) {
          for (let j = i + 1; j < this.particles.length; j++) {
            const p1 = this.particles[i];
            const p2 = this.particles[j];
            
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.options.connectionDistance) {
              const opacity = 1 - (distance / this.options.connectionDistance);
              this.ctx.strokeStyle = this.options.connectionColor.replace('0.1', opacity * 0.2);
              this.ctx.beginPath();
              this.ctx.moveTo(p1.x, p1.y);
              this.ctx.lineTo(p2.x, p2.y);
              this.ctx.stroke();
            }
          }
        }
      }
      
      // Draw particles
      this.particles.forEach(particle => {
        this.ctx.fillStyle = this.options.particleColor.replace('0.2', particle.opacity);
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }
    
    animate() {
      this.update();
      this.draw();
      this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }
    
    start() {
      if (!this.animationFrame) {
        this.animate();
      }
    }
    
    stop() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    }
    
    resize() {
      this.initialize();
    }
  }