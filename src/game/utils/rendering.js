// utils/rendering.js - Complete file with all required exports

// Create tileset for background
export const createTileMap = (ctx, width, height, stage, tileSize = 64) => {
  const tileCanvas = document.createElement('canvas');
  tileCanvas.width = width;
  tileCanvas.height = height;
  const tileCtx = tileCanvas.getContext('2d');
  
  const columns = Math.ceil(width / tileSize);
  const rows = Math.ceil(height / tileSize);
  
  // Get current stage background color - make it darker
  const bgColor = stage?.background?.color || '#050510';
  
  // Fill with background color
  tileCtx.fillStyle = bgColor;
  tileCtx.fillRect(0, 0, width, height);
  
  // Draw floor pattern with more subtle lines
  tileCtx.strokeStyle = 'rgba(60, 30, 90, 0.08)';
  tileCtx.lineWidth = 1;
  
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      const tileX = x * tileSize;
      const tileY = y * tileSize;
      
      // Draw tile with subtle alternating pattern
      if ((x + y) % 2 === 0) {
        tileCtx.fillStyle = 'rgba(60, 30, 90, 0.02)';
        tileCtx.fillRect(tileX, tileY, tileSize, tileSize);
      }
      
      // Draw grid
      tileCtx.strokeRect(tileX, tileY, tileSize, tileSize);
      
      // Add some decoration - fewer particles for cleaner look
      if (Math.random() < 0.03) {
        tileCtx.fillStyle = 'rgba(100, 50, 150, 0.1)';
        tileCtx.beginPath();
        tileCtx.arc(
          tileX + Math.random() * tileSize, 
          tileY + Math.random() * tileSize, 
          Math.random() * 3 + 1,
          0, 
          Math.PI * 2
        );
        tileCtx.fill();
      }
    }
  }
  
  return tileCanvas;
};

// Draw a character sprite
export const drawCharacter = (ctx, x, y, width, height, direction, frame, isPlayer = true, color = '#3498db') => {
ctx.save();

// Character body
const bodyWidth = width * 0.8;
const bodyHeight = height * 0.6;
const headSize = width * 0.6;

// Position adjustments for animation
const bounceOffset = Math.sin(frame * 0.4) * 2;

// Body position
const bodyX = x + (width - bodyWidth) / 2;
const bodyY = y + height - bodyHeight - 5 + (isPlayer ? bounceOffset : 0);

// Draw shadow
ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
ctx.beginPath();
ctx.ellipse(
  x + width / 2,
  y + height - 5,
  width * 0.4,
  height * 0.15,
  0,
  0,
  Math.PI * 2
);
ctx.fill();

// Draw legs
const legWidth = bodyWidth * 0.25;
const legHeight = height * 0.3;

// Left leg with animation
const leftLegOffset = isPlayer ? Math.sin(frame * 0.4) * 5 : 0;
ctx.fillStyle = color;
ctx.fillRect(
  bodyX + bodyWidth * 0.25 - legWidth / 2,
  bodyY + bodyHeight - 2,
  legWidth,
  legHeight + leftLegOffset
);

// Right leg with opposite animation
const rightLegOffset = isPlayer ? Math.sin(frame * 0.4 + Math.PI) * 5 : 0;
ctx.fillRect(
  bodyX + bodyWidth * 0.75 - legWidth / 2,
  bodyY + bodyHeight - 2,
  legWidth,
  legHeight + rightLegOffset
);

// Draw body
ctx.fillStyle = color;
if (isPlayer) {
  // Player has a more detailed body
  // Body
  ctx.fillRect(bodyX, bodyY, bodyWidth, bodyHeight);
  
  // Arms with animation based on direction
  const armWidth = legWidth * 0.8;
  const armHeight = bodyHeight * 0.8;
  
  // Direction-specific drawing
  if (direction === 'left' || direction === 'right') {
    // Arm in front (showing weapon)
    if (direction === 'right') {
      const armOffset = Math.sin(frame * 0.2) * 3;
      ctx.fillRect(
        bodyX + bodyWidth - 2,
        bodyY + bodyHeight * 0.2 + armOffset,
        armWidth + 5,
        armHeight * 0.6
      );
    } else {
      const armOffset = Math.sin(frame * 0.2) * 3;
      ctx.fillRect(
        bodyX - armWidth - 3,
        bodyY + bodyHeight * 0.2 + armOffset,
        armWidth + 5,
        armHeight * 0.6
      );
    }
  } else {
    // Both arms visible for up/down
    const leftArmOffset = Math.sin(frame * 0.3) * 3;
    const rightArmOffset = Math.sin(frame * 0.3 + Math.PI) * 3;
    
    // Left arm
    ctx.fillRect(
      bodyX - armWidth / 2,
      bodyY + bodyHeight * 0.2 + leftArmOffset,
      armWidth,
      armHeight * 0.7
    );
    
    // Right arm
    ctx.fillRect(
      bodyX + bodyWidth - armWidth / 2,
      bodyY + bodyHeight * 0.2 + rightArmOffset,
      armWidth,
      armHeight * 0.7
    );
  }
} else {
  // Enemy has a simpler body based on type
  if (color === 'rgba(217, 217, 217, 0.8)') {
    // Ghost style for transparent enemies
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(bodyX, bodyY);
    ctx.lineTo(bodyX + bodyWidth, bodyY);
    ctx.lineTo(bodyX + bodyWidth, bodyY + bodyHeight * 0.6);
    ctx.quadraticCurveTo(
      bodyX + bodyWidth * 0.8,
      bodyY + bodyHeight * 0.8,
      bodyX + bodyWidth * 0.6,
      bodyY + bodyHeight
    );
    ctx.quadraticCurveTo(
      bodyX + bodyWidth * 0.4,
      bodyY + bodyHeight * 0.8,
      bodyX + bodyWidth * 0.2,
      bodyY + bodyHeight
    );
    ctx.quadraticCurveTo(
      bodyX,
      bodyY + bodyHeight * 0.8,
      bodyX,
      bodyY + bodyHeight * 0.6
    );
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  } else {
    // Standard body for other enemies
    ctx.fillRect(bodyX, bodyY, bodyWidth, bodyHeight);
  }
}

// Head position
const headX = x + (width - headSize) / 2;
const headY = y + height - bodyHeight - headSize - 2 + (isPlayer ? bounceOffset : 0);

// Draw head
ctx.fillStyle = isPlayer ? '#2980b9' : color;
ctx.fillRect(headX, headY, headSize, headSize);

// Draw face elements
if (isPlayer) {
  // Eyes
  ctx.fillStyle = 'white';
  const eyeSize = headSize * 0.2;
  const eyeY = headY + headSize * 0.3;
  
  // Position eyes based on direction
  let leftEyeX, rightEyeX;
  if (direction === 'left') {
    leftEyeX = headX + headSize * 0.15;
    rightEyeX = headX + headSize * 0.4;
  } else if (direction === 'right') {
    leftEyeX = headX + headSize * 0.6;
    rightEyeX = headX + headSize * 0.85;
  } else {
    leftEyeX = headX + headSize * 0.25;
    rightEyeX = headX + headSize * 0.75;
  }
  
  ctx.fillRect(leftEyeX - eyeSize/2, eyeY - eyeSize/2, eyeSize, eyeSize);
  ctx.fillRect(rightEyeX - eyeSize/2, eyeY - eyeSize/2, eyeSize, eyeSize);
  
  // Pupils
  ctx.fillStyle = 'black';
  const pupilSize = eyeSize * 0.6;
  
  // Adjust pupil position based on direction
  let pupilOffsetX = 0;
  let pupilOffsetY = 0;
  if (direction === 'left') pupilOffsetX = -1;
  if (direction === 'right') pupilOffsetX = 1;
  if (direction === 'up') pupilOffsetY = -1;
  if (direction === 'down') pupilOffsetY = 1;
  
  ctx.fillRect(
    leftEyeX - pupilSize/2 + pupilOffsetX, 
    eyeY - pupilSize/2 + pupilOffsetY, 
    pupilSize, 
    pupilSize
  );
  ctx.fillRect(
    rightEyeX - pupilSize/2 + pupilOffsetX, 
    eyeY - pupilSize/2 + pupilOffsetY, 
    pupilSize, 
    pupilSize
  );
} else {
  // Enemy face - different based on enemy type
  if (color === '#5cb85c') { // Zombie
    // Zombie eyes
    ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.arc(headX + headSize * 0.3, headY + headSize * 0.35, headSize * 0.12, 0, Math.PI * 2);
    ctx.arc(headX + headSize * 0.7, headY + headSize * 0.35, headSize * 0.12, 0, Math.PI * 2);
    ctx.fill();
    
    // Zombie mouth
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(headX + headSize * 0.3, headY + headSize * 0.7);
    ctx.lineTo(headX + headSize * 0.7, headY + headSize * 0.7);
    ctx.stroke();
  } else if (color === 'rgba(217, 217, 217, 0.8)') { // Ghost
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.arc(headX + headSize * 0.3, headY + headSize * 0.35, headSize * 0.1, 0, Math.PI * 2);
    ctx.arc(headX + headSize * 0.7, headY + headSize * 0.35, headSize * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    // Ghost mouth
    ctx.beginPath();
    ctx.arc(headX + headSize * 0.5, headY + headSize * 0.6, headSize * 0.1, 0, Math.PI);
    ctx.fill();
  } else if (color === '#f0ad4e') { // Skeleton
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(headX + headSize * 0.3, headY + headSize * 0.35, headSize * 0.1, 0, Math.PI * 2);
    ctx.arc(headX + headSize * 0.7, headY + headSize * 0.35, headSize * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    // Skeleton teeth
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(headX + headSize * (0.35 + i * 0.15), headY + headSize * 0.6);
      ctx.lineTo(headX + headSize * (0.35 + i * 0.15), headY + headSize * 0.7);
      ctx.stroke();
    }
  } else if (color === '#d9534f') { // Boss
    // Boss eyes
    ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
    ctx.beginPath();
    ctx.arc(headX + headSize * 0.3, headY + headSize * 0.35, headSize * 0.15, 0, Math.PI * 2);
    ctx.arc(headX + headSize * 0.7, headY + headSize * 0.35, headSize * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    // Boss pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(headX + headSize * 0.3, headY + headSize * 0.35, headSize * 0.07, 0, Math.PI * 2);
    ctx.arc(headX + headSize * 0.7, headY + headSize * 0.35, headSize * 0.07, 0, Math.PI * 2);
    ctx.fill();
    
    // Boss horns
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(headX, headY);
    ctx.lineTo(headX - headSize * 0.2, headY - headSize * 0.3);
    ctx.lineTo(headX + headSize * 0.1, headY);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(headX + headSize, headY);
    ctx.lineTo(headX + headSize + headSize * 0.2, headY - headSize * 0.3);
    ctx.lineTo(headX + headSize - headSize * 0.1, headY);
    ctx.fill();
    
    // Boss mouth
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(headX + headSize * 0.5, headY + headSize * 0.65, headSize * 0.25, 0, Math.PI);
    ctx.fill();
    
    // Boss teeth
    ctx.fillStyle = 'white';
    const teethCount = 4;
    const teethWidth = (headSize * 0.5) / teethCount;
    for (let i = 0; i < teethCount; i++) {
      ctx.beginPath();
      ctx.moveTo(headX + headSize * 0.25 + i * teethWidth, headY + headSize * 0.65);
      ctx.lineTo(headX + headSize * 0.25 + (i + 0.5) * teethWidth, headY + headSize * 0.8);
      ctx.lineTo(headX + headSize * 0.25 + (i + 1) * teethWidth, headY + headSize * 0.65);
      ctx.fill();
    }
  }
}

ctx.restore();
};

// Draw a projectile
export const drawProjectile = (ctx, projectile, type) => {
ctx.save();

if (type === 'wand') {
  // Draw magical projectile with glowing effect
  const gradient = ctx.createRadialGradient(
    projectile.x, projectile.y, 0,
    projectile.x, projectile.y, projectile.radius
  );
  gradient.addColorStop(0, 'rgba(0, 255, 255, 1)');
  gradient.addColorStop(0.7, 'rgba(0, 200, 255, 0.7)');
  gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, projectile.radius * 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner core
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, projectile.radius * 0.5, 0, Math.PI * 2);
  ctx.fill();
} else if (type === 'axe') {
  // Translate to center and rotate
  ctx.translate(projectile.x, projectile.y);
  ctx.rotate(projectile.rotation);
  
  // Draw axe handle
  ctx.fillStyle = '#8B4513'; // Brown
  ctx.fillRect(-projectile.width / 2, -projectile.height / 4, projectile.width, projectile.height / 2);
  
  // Draw axe heads
  ctx.fillStyle = '#A9A9A9'; // Silver
  
  // Left axe head
  ctx.beginPath();
  ctx.moveTo(-projectile.width / 2, -projectile.height / 4);
  ctx.lineTo(-projectile.width / 2 - projectile.width / 3, -projectile.height / 2);
  ctx.lineTo(-projectile.width / 2 - projectile.width / 3, projectile.height / 4);
  ctx.lineTo(-projectile.width / 2, projectile.height / 4);
  ctx.closePath();
  ctx.fill();
  
  // Right axe head
  ctx.beginPath();
  ctx.moveTo(projectile.width / 2, -projectile.height / 4);
  ctx.lineTo(projectile.width / 2 + projectile.width / 3, -projectile.height / 2);
  ctx.lineTo(projectile.width / 2 + projectile.width / 3, projectile.height / 4);
  ctx.lineTo(projectile.width / 2, projectile.height / 4);
  ctx.closePath();
  ctx.fill();
  
  // Add shine
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(projectile.width / 2, -projectile.height / 6);
  ctx.lineTo(projectile.width / 2 + projectile.width / 4, -projectile.height / 3);
  ctx.stroke();
}

ctx.restore();
};

// Draw a glowing experience gem
export const drawGem = (ctx, gem, time) => {
ctx.save();

// Pulse effect
const pulse = Math.sin(time / 200) * 0.2 + 0.8;
const size = gem.width * pulse;

// Draw glow effect
const gradient = ctx.createRadialGradient(
  gem.x, gem.y, 0,
  gem.x, gem.y, size * 1.5
);
gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
gradient.addColorStop(0.5, 'rgba(0, 200, 255, 0.4)');
gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');

ctx.fillStyle = gradient;
ctx.beginPath();
ctx.arc(gem.x, gem.y, size * 1.5, 0, Math.PI * 2);
ctx.fill();

// Draw crystal gem shape
ctx.fillStyle = '#00FFFF';

// Gem shape (hexagon)
ctx.beginPath();
for (let i = 0; i < 6; i++) {
  const angle = Math.PI / 3 * i;
  const x = gem.x + Math.cos(angle) * size;
  const y = gem.y + Math.sin(angle) * size;
  if (i === 0) {
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
  }
}
ctx.closePath();
ctx.fill();

// Add center shine
ctx.fillStyle = 'white';
ctx.beginPath();
ctx.arc(gem.x, gem.y, size * 0.3, 0, Math.PI * 2);
ctx.fill();

ctx.restore();
};

// Draw fire aura effect
export const drawFireAura = (ctx, x, y, radius, time) => {
ctx.save();

// Create gradient
const gradient = ctx.createRadialGradient(
  x, y, radius * 0.2,
  x, y, radius
);
gradient.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
gradient.addColorStop(0.5, 'rgba(255, 50, 0, 0.5)');
gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

ctx.fillStyle = gradient;

// Draw base circle
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2);
ctx.fill();

ctx.restore();
};

// Draw a damage number that floats up
export const drawDamageText = (ctx, text) => {
ctx.save();

// Text settings
ctx.font = `${Math.min(24, 14 + text.value / 5)}px Arial`;
ctx.textAlign = 'center';

// Progress from 0 to 1
const progress = text.currentFrame / text.duration;

// Fade out as it rises
ctx.globalAlpha = 1 - progress;

// Color based on damage value
if (text.isCritical) {
  ctx.fillStyle = '#FF0000';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.strokeText(text.value, text.x, text.y - progress * 30);
  ctx.fillText(text.value, text.x, text.y - progress * 30);
} else {
  ctx.fillStyle = text.isPlayer ? '#FF5555' : '#FFFFFF';
  ctx.fillText(text.value, text.x, text.y - progress * 30);
}

ctx.restore();
};

// Draw a particle effect
export const drawParticleEffect = (ctx, particle) => {
ctx.save();

// Progress from 0 to 1
const progress = particle.currentFrame / particle.duration;

// Fade out gradually
ctx.globalAlpha = 1 - progress;

if (particle.type === 'particle') {
  // Magic particle
  ctx.fillStyle = particle.color;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size * (1 - progress), 0, Math.PI * 2);
  ctx.fill();
} else if (particle.type === 'flame') {
  // Flame particle
  ctx.fillStyle = particle.color;
  
  // Movement
  particle.x += Math.cos(particle.angle) * particle.speed;
  particle.y += Math.sin(particle.angle) * particle.speed;
  
  // Shrink over time
  const currentSize = particle.size * (1 - progress);
  
  // Flame shape
  ctx.beginPath();
  ctx.moveTo(particle.x, particle.y - currentSize);
  ctx.quadraticCurveTo(
    particle.x + currentSize / 2, 
    particle.y - currentSize / 2,
    particle.x, 
    particle.y + currentSize
  );
  ctx.quadraticCurveTo(
    particle.x - currentSize / 2, 
    particle.y - currentSize / 2,
    particle.x, 
    particle.y - currentSize
  );
  ctx.fill();
} else if (particle.type === 'hit') {
  // Hit impact effect
  ctx.fillStyle = particle.color;
  
  // Expanding circle
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size * progress * 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Sparks
  if (particle.currentFrame < particle.duration / 2) {
    const sparkCount = 6;
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = 2 * (1 - progress * 2);
    
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i / sparkCount) * Math.PI * 2;
      const length = particle.size * progress * 3;
      
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(
        particle.x + Math.cos(angle) * length,
        particle.y + Math.sin(angle) * length
      );
      ctx.stroke();
    }
  }
}

ctx.restore();
};


// Draw UI elements (continued)
export const drawUI = (ctx, canvas, gameData, gameState) => {
  const { 
    playerStats, 
    experience, 
    experienceToNextLevel, 
    score, 
    time, 
    level, // Make sure you use level from gameState
    stage, 
    stageMessage, 
    showStageMessage, 
    stageMessageTimerRef 
  } = gameState;
  
  // Health bar with glowing effect
  const healthPercent = Math.max(0, playerStats.health / playerStats.maxHealth);


  // Add Second Chance indicator if available
if (playerStats.reviveCount && playerStats.reviveCount > 0) {
  // Create pulsing effect for the indicator
  const time = Date.now();
  const pulseIntensity = 0.5 + Math.sin(time * 0.005) * 0.2;
  
  // Draw golden aura
  const auraGradient = ctx.createRadialGradient(
    135, 170, 0, 
    135, 170, 15
  );
  auraGradient.addColorStop(0, `rgba(255, 215, 0, ${pulseIntensity})`);
  auraGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
  
  ctx.fillStyle = auraGradient;
  ctx.beginPath();
  ctx.arc(135, 170, 15, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw indicator icon
  ctx.fillStyle = '#FFD700'; // Gold color
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`✨ Second Chance Ready ✨`, 110, 170);
  ctx.textAlign = 'left'; // Reset alignment
}
  
  // Health bar container
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.fillRect(20, 20, 200, 20);
  ctx.strokeRect(20, 20, 200, 20);
  
  // Health bar fill with gradient
  const healthGradient = ctx.createLinearGradient(20, 20, 220, 20);
  if (healthPercent > 0.5) {
    healthGradient.addColorStop(0, '#27ae60');
    healthGradient.addColorStop(1, '#2ecc71');
  } else if (healthPercent > 0.2) {
    healthGradient.addColorStop(0, '#d35400');
    healthGradient.addColorStop(1, '#e67e22');
  } else {
    healthGradient.addColorStop(0, '#c0392b');
    healthGradient.addColorStop(1, '#e74c3c');
  }
  
  ctx.fillStyle = healthGradient;
  ctx.fillRect(20, 20, 200 * healthPercent, 20);
  
  // Add shine to health bar
  if (healthPercent > 0) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(20, 20, 200 * healthPercent, 5);
  }
  
  // Health text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 12px Arial';
  ctx.fillText(`${Math.ceil(playerStats.health)}/${playerStats.maxHealth}`, 25, 35);
  
  // Experience bar
  const expPercent = experience / experienceToNextLevel;
  
  // Exp bar container
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.strokeStyle = '#333';
  ctx.fillRect(20, 50, 200, 10);
  ctx.strokeRect(20, 50, 200, 10);
  
  // Exp bar fill with gradient
  const expGradient = ctx.createLinearGradient(20, 50, 220, 50);
  expGradient.addColorStop(0, '#8e44ad');
  expGradient.addColorStop(1, '#9b59b6');
  
  ctx.fillStyle = expGradient;
  ctx.fillRect(20, 50, 200 * expPercent, 10);
  
  // Add shine to exp bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(20, 50, 200 * expPercent, 3);
  
  // Stats panel
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.strokeStyle = '#333';
  ctx.fillRect(20, 70, 180, 95);
  ctx.strokeRect(20, 70, 180, 95);
  
  // Stats text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px Arial';
  ctx.fillText(`Level: ${level || 1}`, 30, 90); // Use level with fallback
  ctx.fillText(`Score: ${score}`, 30, 110);
  
  // Time
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  ctx.fillText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`, 30, 130);
  
  // Stage
  ctx.fillText(`Stage: ${stage}`, 30, 150);
  
  // Draw stage announcement if active
  if (showStageMessage && stageMessageTimerRef?.current) {
    ctx.save();
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(canvas.width / 2 - 250, canvas.height / 2 - 50, 500, 100);
    
    // Border
    ctx.strokeStyle = '#9b59b6';
    ctx.lineWidth = 4;
    ctx.strokeRect(canvas.width / 2 - 250, canvas.height / 2 - 50, 500, 100);
    
    // Glow
    ctx.shadowColor = '#9b59b6';
    ctx.shadowBlur = 15;
    
    // Text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stageMessage, canvas.width / 2, canvas.height / 2);
    
    // Reset
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.shadowBlur = 0;
    ctx.restore();
  }
  
  // Draw weapons/upgrade indicators
  let iconX = canvas.width - 30;
  const iconY = 30;
  const iconSize = 24;
  const iconPadding = 10;
  
  if (gameData.player.weapons) {
    gameData.player.weapons.forEach(weapon => {
      ctx.save();
      
      // Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(iconX - iconSize, iconY - iconSize / 2, iconSize, iconSize);
      ctx.strokeStyle = '#333';
      ctx.strokeRect(iconX - iconSize, iconY - iconSize / 2, iconSize, iconSize);
      
      // Icon
      if (weapon.type === 'wand') {
        // Draw wand icon with level-specific colors
        let wandColor;
        if (weapon.level === 1) {
          wandColor = '#00FFFF'; // Blue for level 1
        } else if (weapon.level === 2) {
          wandColor = '#9932CC'; // Purple for level 2
        } else {
          wandColor = '#FFD700'; // Gold for level 3
        }


        // Draw wand icon
        ctx.fillStyle = '#00FFFF';
        ctx.beginPath();
        ctx.arc(iconX - iconSize / 2, iconY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Level indicator
        if (weapon.level > 1) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(weapon.level, iconX - iconSize / 2, iconY + 12);
        }
      } else if (weapon.type === 'axe') {
        // Draw axe icon
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.moveTo(iconX - iconSize / 2 - 5, iconY - 5);
        ctx.lineTo(iconX - iconSize / 2 + 5, iconY - 5);
        ctx.lineTo(iconX - iconSize / 2 + 5, iconY + 5);
        ctx.lineTo(iconX - iconSize / 2 - 5, iconY + 5);
        ctx.closePath();
        ctx.fill();
        
        // Level indicator
        if (weapon.level > 1) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(weapon.level, iconX - iconSize / 2, iconY + 12);
        }
      } else if (weapon.type === 'fire') {
        // Draw fire icon
        const gradient = ctx.createRadialGradient(
          iconX - iconSize / 2, iconY, 0,
          iconX - iconSize / 2, iconY, 8
        );
        gradient.addColorStop(0, 'rgba(255, 200, 0, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0.6)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(iconX - iconSize / 2, iconY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Level indicator
        if (weapon.level > 1) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(weapon.level, iconX - iconSize / 2, iconY + 12);
        }
      }
      
      ctx.restore();
      iconX -= iconSize + iconPadding;
    });
  }
};