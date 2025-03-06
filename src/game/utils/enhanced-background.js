// Enhanced background and tilemap rendering
export const createEnhancedTileMap = (ctx, width, height, stage) => {
    // Create a new canvas for the tilemap
    const tileCanvas = document.createElement('canvas');
    tileCanvas.width = width;
    tileCanvas.height = height;
    const tileCtx = tileCanvas.getContext('2d');
    
    // Get stage configuration or use defaults
    const stageConfig = stage || { background: { color: '#050510' } };
    const baseColor = stageConfig.background?.color || '#050510';
    
    // Parse base color to RGB components for manipulation
    let baseR, baseG, baseB;
    const hexMatch = baseColor.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    if (hexMatch) {
      baseR = parseInt(hexMatch[1], 16);
      baseG = parseInt(hexMatch[2], 16);
      baseB = parseInt(hexMatch[3], 16);
    } else {
      // Default dark purple if color parsing fails
      baseR = 5;
      baseG = 5;
      baseB = 16;
    }
    
    // Create a gradient background with depth
    const gradient = tileCtx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `rgb(${Math.max(0, baseR - 3)}, ${Math.max(0, baseG - 3)}, ${Math.min(255, baseB + 5)})`);
    gradient.addColorStop(1, `rgb(${Math.min(255, baseR + 3)}, ${Math.max(0, baseG - 3)}, ${Math.max(0, baseB - 3)})`);
    
    // Fill background with gradient
    tileCtx.fillStyle = gradient;
    tileCtx.fillRect(0, 0, width, height);
    
    // Create a more interesting tile pattern
    const tileSize = 64;
    const columns = Math.ceil(width / tileSize);
    const rows = Math.ceil(height / tileSize);
  
    // Draw tiles with subtle variations
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        const tileX = x * tileSize;
        const tileY = y * tileSize;
        
        // Create alternating pattern with subtle color differences
        const isAlternate = (x + y) % 2 === 0;
        
        // Base tile color - slightly different based on alternating pattern
        if (isAlternate) {
          tileCtx.fillStyle = `rgba(${baseR + 10}, ${baseG + 5}, ${baseB + 15}, 0.05)`;
          tileCtx.fillRect(tileX, tileY, tileSize, tileSize);
        }
        
        // Draw detailed tile patterns
        drawTileDetail(tileCtx, tileX, tileY, tileSize, baseR, baseG, baseB, isAlternate);
      }
    }
    
    // Add overall grid pattern
    tileCtx.strokeStyle = `rgba(${Math.min(255, baseR + 60)}, ${Math.min(255, baseG + 30)}, ${Math.min(255, baseB + 90)}, 0.07)`;
    tileCtx.lineWidth = 1;
    
    // Draw horizontal grid lines
    for (let y = 0; y <= rows; y++) {
      tileCtx.beginPath();
      tileCtx.moveTo(0, y * tileSize);
      tileCtx.lineTo(width, y * tileSize);
      tileCtx.stroke();
    }
    
    // Draw vertical grid lines
    for (let x = 0; x <= columns; x++) {
      tileCtx.beginPath();
      tileCtx.moveTo(x * tileSize, 0);
      tileCtx.lineTo(x * tileSize, height);
      tileCtx.stroke();
    }
    
    // Add atmospheric particles and elements
    addAtmosphericElements(tileCtx, width, height, baseR, baseG, baseB, stageConfig);
    
    // Add subtle vignette effect (darkened corners)
    addVignette(tileCtx, width, height);
    
    return tileCanvas;
  };
  
  // Helper function to draw detailed tile patterns
  function drawTileDetail(ctx, x, y, size, baseR, baseG, baseB, isAlternate) {
    // Subtle inner borders
    ctx.strokeStyle = `rgba(${Math.min(255, baseR + 60)}, ${Math.min(255, baseG + 30)}, ${Math.min(255, baseB + 90)}, 0.05)`;
    ctx.lineWidth = 1;
    
    // Inner border with padding
    const padding = 4;
    ctx.strokeRect(x + padding, y + padding, size - padding * 2, size - padding * 2);
    
    // Add corner details to some tiles
    if (Math.random() < 0.3) {
      const cornerSize = size / 6;
      ctx.strokeStyle = `rgba(${Math.min(255, baseR + 70)}, ${Math.min(255, baseG + 40)}, ${Math.min(255, baseB + 100)}, 0.07)`;
      
      // Randomly choose which corners to decorate
      if (Math.random() < 0.5) {
        // Top-left corner
        ctx.beginPath();
        ctx.moveTo(x + padding, y + padding + cornerSize);
        ctx.lineTo(x + padding, y + padding);
        ctx.lineTo(x + padding + cornerSize, y + padding);
        ctx.stroke();
      }
      
      if (Math.random() < 0.5) {
        // Top-right corner
        ctx.beginPath();
        ctx.moveTo(x + size - padding - cornerSize, y + padding);
        ctx.lineTo(x + size - padding, y + padding);
        ctx.lineTo(x + size - padding, y + padding + cornerSize);
        ctx.stroke();
      }
      
      if (Math.random() < 0.5) {
        // Bottom-right corner
        ctx.beginPath();
        ctx.moveTo(x + size - padding, y + size - padding - cornerSize);
        ctx.lineTo(x + size - padding, y + size - padding);
        ctx.lineTo(x + size - padding - cornerSize, y + size - padding);
        ctx.stroke();
      }
      
      if (Math.random() < 0.5) {
        // Bottom-left corner
        ctx.beginPath();
        ctx.moveTo(x + padding + cornerSize, y + size - padding);
        ctx.lineTo(x + padding, y + size - padding);
        ctx.lineTo(x + padding, y + size - padding - cornerSize);
        ctx.stroke();
      }
    }
    
    // Add small magical runes or symbols to some tiles (rare)
    if (Math.random() < 0.08) {
      drawMagicalSymbol(ctx, x + size/2, y + size/2, size/4, baseR, baseG, baseB);
    }
    
    // Add small decorative elements to some tiles
    if (Math.random() < 0.15) {
      // Small dots in corners or center
      ctx.fillStyle = `rgba(${Math.min(255, baseR + 100)}, ${Math.min(255, baseG + 50)}, ${Math.min(255, baseB + 130)}, 0.15)`;
      
      const dotPositions = isAlternate ? 
        [[0.25, 0.25], [0.75, 0.75]] : 
        [[0.25, 0.75], [0.75, 0.25]];
      
      dotPositions.forEach(pos => {
        if (Math.random() < 0.7) {
          ctx.beginPath();
          ctx.arc(
            x + size * pos[0], 
            y + size * pos[1], 
            1 + Math.random() * 2, 
            0, 
            Math.PI * 2
          );
          ctx.fill();
        }
      });
    }
  }
  
  // Helper function to draw magical symbols
  function drawMagicalSymbol(ctx, x, y, size, baseR, baseG, baseB) {
    ctx.save();
    
    // Choose a symbol style
    const symbolType = Math.floor(Math.random() * 5);
    
    // Set color and opacity
    ctx.strokeStyle = `rgba(${Math.min(255, baseR + 120)}, ${Math.min(255, baseG + 60)}, ${Math.min(255, baseB + 150)}, 0.2)`;
    ctx.lineWidth = 1;
    
    // Position at center point
    ctx.translate(x, y);
    
    // Add slight rotation for variety
    ctx.rotate(Math.random() * Math.PI * 2);
    
    // Draw different symbol types
    switch(symbolType) {
      case 0: // Circle with cross
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.moveTo(-size/2, 0);
        ctx.lineTo(size/2, 0);
        ctx.moveTo(0, -size/2);
        ctx.lineTo(0, size/2);
        ctx.stroke();
        break;
        
      case 1: // Triangle
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(-size/2, size/2);
        ctx.lineTo(size/2, size/2);
        ctx.closePath();
        ctx.stroke();
        break;
        
      case 2: // Pentagon
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const pointX = Math.cos(angle) * size/2;
          const pointY = Math.sin(angle) * size/2;
          if (i === 0) {
            ctx.moveTo(pointX, pointY);
          } else {
            ctx.lineTo(pointX, pointY);
          }
        }
        ctx.closePath();
        ctx.stroke();
        break;
        
      case 3: // Square with dot in middle
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size, size);
        ctx.stroke();
        
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.arc(0, 0, size/8, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 4: // Star
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const outerAngle = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const innerAngle = outerAngle + Math.PI / 5;
          
          const outerX = Math.cos(outerAngle) * size/2;
          const outerY = Math.sin(outerAngle) * size/2;
          const innerX = Math.cos(innerAngle) * size/4;
          const innerY = Math.sin(innerAngle) * size/4;
          
          if (i === 0) {
            ctx.moveTo(outerX, outerY);
          } else {
            ctx.lineTo(outerX, outerY);
          }
          
          ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.stroke();
        break;
    }
    
    ctx.restore();
  }
  
  // Add atmospheric elements based on stage configuration
  function addAtmosphericElements(ctx, width, height, baseR, baseG, baseB, stageConfig) {
    // Add magic dust particles
    const particleCount = Math.floor(width * height / 20000); // Scale with canvas size
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2.5 + 0.5;
      
      // Create glow effect for particles
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
      gradient.addColorStop(0, `rgba(${Math.min(255, baseR + 150)}, ${Math.min(255, baseG + 100)}, ${Math.min(255, baseB + 200)}, 0.6)`);
      gradient.addColorStop(0.5, `rgba(${Math.min(255, baseR + 120)}, ${Math.min(255, baseG + 80)}, ${Math.min(255, baseB + 180)}, 0.3)`);
      gradient.addColorStop(1, `rgba(${Math.min(255, baseR + 100)}, ${Math.min(255, baseG + 60)}, ${Math.min(255, baseB + 150)}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add larger ambient light sources (rare)
    const lightSourceCount = Math.floor(width * height / 300000); // Fewer light sources
    
    for (let i = 0; i < lightSourceCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 40 + 20;
      
      // Create large glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, `rgba(${Math.min(255, baseR + 100)}, ${Math.min(255, baseG + 50)}, ${Math.min(255, baseB + 150)}, 0.1)`);
      gradient.addColorStop(0.7, `rgba(${Math.min(255, baseR + 80)}, ${Math.min(255, baseG + 40)}, ${Math.min(255, baseB + 120)}, 0.05)`);
      gradient.addColorStop(1, `rgba(${Math.min(255, baseR + 60)}, ${Math.min(255, baseG + 30)}, ${Math.min(255, baseB + 100)}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add subtle fog/mist effect if needed for certain stages
    if (stageConfig.hasFog) {
      // Create horizontal fog bands
      const fogBandCount = 3;
      
      for (let i = 0; i < fogBandCount; i++) {
        const y = height * (0.2 + i * 0.3);
        const fogHeight = height * 0.15;
        
        const gradient = ctx.createLinearGradient(0, y - fogHeight/2, 0, y + fogHeight/2);
        gradient.addColorStop(0, `rgba(${Math.min(255, baseR + 30)}, ${Math.min(255, baseG + 30)}, ${Math.min(255, baseB + 40)}, 0)`);
        gradient.addColorStop(0.5, `rgba(${Math.min(255, baseR + 30)}, ${Math.min(255, baseG + 30)}, ${Math.min(255, baseB + 40)}, 0.1)`);
        gradient.addColorStop(1, `rgba(${Math.min(255, baseR + 30)}, ${Math.min(255, baseG + 30)}, ${Math.min(255, baseB + 40)}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, y - fogHeight/2, width, fogHeight);
      }
    }
  }
  
  // Add vignette effect (darkened corners)
  function addVignette(ctx, width, height) {
    const gradient = ctx.createRadialGradient(
      width/2, height/2, 0,
      width/2, height/2, Math.sqrt(width*width + height*height)/2
    );
    
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.9, 'rgba(0, 0, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  // Add animated elements for the background
  export const drawAnimatedBackgroundEffects = (ctx, canvas, time, bgOffset) => {
    // Calculate time-based variables for animations
    const animTime = time * 0.001; // Convert to seconds
    
    // Add floating magical particles that move slowly
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      // Use sine and cosine for smooth floating motion
      const angle = animTime * 0.2 + i * (Math.PI * 2 / particleCount);
      const radiusX = 100 + Math.sin(angle * 0.7) * 50;
      const radiusY = 80 + Math.cos(angle * 0.5) * 30;
      
      const x = (canvas.width/2 + Math.cos(angle) * radiusX + bgOffset.x) % canvas.width;
      const y = (canvas.height/2 + Math.sin(angle) * radiusY + bgOffset.y) % canvas.height;
      
      // Size pulsing
      const size = 2 + Math.sin(animTime * 2 + i) * 1;
      
      // Create glowing particle
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
      gradient.addColorStop(0, 'rgba(150, 100, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(100, 50, 200, 0.4)');
      gradient.addColorStop(1, 'rgba(80, 30, 150, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add occasional magic burst/flash effect (rare)
    if (Math.random() < 0.02) {
      const burstX = Math.random() * canvas.width;
      const burstY = Math.random() * canvas.height;
      const burstSize = 30 + Math.random() * 20;
      
      const gradient = ctx.createRadialGradient(burstX, burstY, 0, burstX, burstY, burstSize);
      gradient.addColorStop(0, 'rgba(180, 130, 255, 0.3)');
      gradient.addColorStop(0.7, 'rgba(120, 80, 200, 0.1)');
      gradient.addColorStop(1, 'rgba(100, 50, 180, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(burstX, burstY, burstSize, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Refined and more subtle background animations
export const drawRefinedBackgroundEffects = (ctx, canvas, time, bgOffset) => {
    // Calculate time-based variables for animations
    const animTime = time * 0.001; // Convert to seconds
    
    // Add smaller, more subtle magical particles
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      // More randomized positions with subtle movement
      const baseX = (i * canvas.width / particleCount + animTime * 5) % canvas.width;
      const baseY = (canvas.height * (0.2 + 0.6 * ((i * 13) % 10) / 10) + Math.sin(animTime * 0.2 + i) * 15);
      
      // Apply background offset for parallax
      const x = (baseX + bgOffset.x * 0.3) % canvas.width;
      const y = (baseY + bgOffset.y * 0.3) % canvas.height;
      
      // Much smaller size with subtle pulsing
      const size = 0.8 + Math.sin(animTime * 1.5 + i * 0.3) * 0.4;
      
      // More transparent and subtle gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
      gradient.addColorStop(0, 'rgba(150, 100, 255, 0.4)');
      gradient.addColorStop(0.5, 'rgba(100, 50, 200, 0.2)');
      gradient.addColorStop(1, 'rgba(80, 30, 150, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add distant stars/magical dust (tiny, barely noticeable points)
    const starCount = 50;
    ctx.fillStyle = 'rgba(200, 200, 255, 0.3)';
    
    for (let i = 0; i < starCount; i++) {
      const x = (i * 37 % canvas.width + animTime * (i % 5) * 0.5 + bgOffset.x * 0.1) % canvas.width;
      const y = (i * 23 % canvas.height + animTime * ((i + 2) % 3) * 0.3 + bgOffset.y * 0.1) % canvas.height;
      
      // Very small dots with slight pulsing
      const starSize = 0.5 + Math.sin(animTime * 0.7 + i) * 0.2;
      
      if (starSize > 0.3) {
        ctx.beginPath();
        ctx.arc(x, y, starSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Add very occasional magic shimmer (much less frequent and smaller)
    if (Math.random() < 0.005) {
      const shimmerX = Math.random() * canvas.width;
      const shimmerY = Math.random() * canvas.height;
      const shimmerSize = 10 + Math.random() * 10; // Much smaller than before
      
      const gradient = ctx.createRadialGradient(shimmerX, shimmerY, 0, shimmerX, shimmerY, shimmerSize);
      gradient.addColorStop(0, 'rgba(180, 130, 255, 0.2)');
      gradient.addColorStop(0.5, 'rgba(120, 80, 200, 0.1)');
      gradient.addColorStop(1, 'rgba(100, 50, 180, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(shimmerX, shimmerY, shimmerSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add subtle energy lines that occasionally appear and fade (rare)
    if (Math.random() < 0.01) {
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height;
      const length = 20 + Math.random() * 30;
      const angle = Math.random() * Math.PI * 2;
      
      const endX = startX + Math.cos(angle) * length;
      const endY = startY + Math.sin(angle) * length;
      
      // Create subtle line gradient
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, 'rgba(100, 100, 255, 0.1)');
      gradient.addColorStop(0.5, 'rgba(130, 100, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(100, 100, 255, 0.1)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  };

  // Create a V// Create an improved Vampire Survivors-style background
  export const createVampireSurvivorsBackground = (ctx, width, height) => {
    // Create a new canvas for the tilemap
    const tileCanvas = document.createElement('canvas');
    tileCanvas.width = width;
    tileCanvas.height = height;
    const tileCtx = tileCanvas.getContext('2d');
    
    // Just fill with a solid color
    tileCtx.fillStyle = '#2a7d2a'; // Dark green base
    tileCtx.fillRect(0, 0, width, height);
    
    // Add minimal grid lines for some visual reference
    tileCtx.strokeStyle = 'rgba(20, 50, 20, 0.1)';
    tileCtx.lineWidth = 1;
    
    const tileSize = 120;
    const columns = Math.ceil(width / tileSize);
    const rows = Math.ceil(height / tileSize);
    
    // Draw minimal grid
    for (let y = 0; y <= rows; y++) {
      tileCtx.beginPath();
      tileCtx.moveTo(0, y * tileSize);
      tileCtx.lineTo(width, y * tileSize);
      tileCtx.stroke();
    }
    
    for (let x = 0; x <= columns; x++) {
      tileCtx.beginPath();
      tileCtx.moveTo(x * tileSize, 0);
      tileCtx.lineTo(x * tileSize, height);
      tileCtx.stroke();
    }
    
    return tileCanvas;
  };


  // Add this to your enhanced-background.js file
export const createInfiniteBackground = (ctx, width, height) => {
  const tileCanvas = document.createElement('canvas');
  const tileSize = 128; // Size of a single tile
  
  // Make the pattern tile relatively small for better performance
  tileCanvas.width = tileSize;
  tileCanvas.height = tileSize;
  
  const tileCtx = tileCanvas.getContext('2d');
  
  // Fill with base color
  tileCtx.fillStyle = '#2a7d2a'; // Dark green base
  tileCtx.fillRect(0, 0, tileSize, tileSize);
  
  // Add subtle pattern details
  tileCtx.strokeStyle = 'rgba(60, 100, 60, 0.2)'; // Slightly lighter green
  tileCtx.lineWidth = 1;
  
  // Draw a subtle grid
  tileCtx.beginPath();
  tileCtx.moveTo(0, 0);
  tileCtx.lineTo(tileSize, 0);
  tileCtx.lineTo(tileSize, tileSize);
  tileCtx.lineTo(0, tileSize);
  tileCtx.closePath();
  tileCtx.stroke();
  
  // Add some random dots
  tileCtx.fillStyle = 'rgba(60, 120, 60, 0.15)';
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * tileSize;
    const y = Math.random() * tileSize;
    const size = 1 + Math.random() * 2;
    
    tileCtx.beginPath();
    tileCtx.arc(x, y, size, 0, Math.PI * 2);
    tileCtx.fill();
  }
  
  return tileCanvas;
};
