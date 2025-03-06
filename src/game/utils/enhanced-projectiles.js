// Enhanced projectile and attack effects


  
  
  
  // Add trail to projectiles - call this from updateWeapons()
  export const updateProjectileTrails = (weapon) => {
    if (!weapon.projectiles) return;
    
    weapon.projectiles.forEach(projectile => {
      // Initialize trail if it doesn't exist
      if (!projectile.trailPositions) {
        projectile.trailPositions = [];
      }
      
      // Add current position to trail
      projectile.trailPositions.unshift({
        x: projectile.x,
        y: projectile.y,
        rotation: projectile.rotation // Only used for axes
      });
      
      // Limit trail length
      const maxTrailLength = weapon.type === 'wand' ? 6 : 5;
      if (projectile.trailPositions.length > maxTrailLength) {
        projectile.trailPositions.pop();
      }
    });
  };
  
  export const drawEnhancedDamageText = (ctx, text) => {
    ctx.save();
    
    // Progress from 0 to 1
    const progress = text.currentFrame / text.duration;
    
    // Fade out as it rises, but keep it visible longer
    ctx.globalAlpha = progress < 0.7 ? 1 : 1 - ((progress - 0.7) / 0.3);
    
    // Determine text size based on damage value and critical status
    const baseSize = Math.min(26, 14 + text.value / 5);
    let textSize = baseSize;
    
    // Font settings with pixel font for game feel
    if (text.isCritical) {
      // Critical hits have larger animated text
      textSize = baseSize * (1.2 + Math.sin(text.currentFrame * 0.5) * 0.1);
      ctx.font = `bold ${textSize}px 'Courier New', monospace`;
      
      // Add shadow behind critical text for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    } else {
      ctx.font = `${textSize}px 'Courier New', monospace`;
      
      // Light shadow for normal hits
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
    }
    
    ctx.textAlign = 'center';
    
    // Bounce effect for movement
    let yOffset = -progress * 35;
    if (text.isCritical) {
      // Add bounce for critical hits
      yOffset += Math.sin(progress * Math.PI) * 10;
    }
    
    // Color based on damage value
    if (text.isCritical) {
      // Critical hit with enhanced visuals
      const critGradient = ctx.createLinearGradient(
        text.x, text.y + yOffset - textSize,
        text.x, text.y + yOffset
      );
      critGradient.addColorStop(0, '#FF9500');
      critGradient.addColorStop(0.5, '#FF0000');
      critGradient.addColorStop(1, '#FF5500');
      
      // Draw text stroke
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.strokeText(text.value.toString(), text.x, text.y + yOffset);
      
      // Draw text fill
      ctx.fillStyle = critGradient;
      const worldX = text.x;
      const worldY = text.y;
      
      // The rest of your function...
      ctx.fillText(text.value.toString(), worldX, worldY + yOffset);
      
      // Add "CRITICAL" text below for big hits
      if (text.value > 30) {
        ctx.font = `${textSize * 0.4}px 'Courier New', monospace`;
        ctx.fillStyle = '#FFFF00';
        ctx.fillText("CRITICAL", text.x, text.y + yOffset + textSize * 0.6);
      }
      
      // Add mini explosion effect around critical hit text
      if (text.currentFrame < text.duration * 0.5) {
        // Small particles bursting from the text
        const particleCount = 8;
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.PI * 2 * i / particleCount;
          const dist = textSize * (0.5 + progress * 2);
          const px = text.x + Math.cos(angle) * dist;
          const py = text.y + yOffset + Math.sin(angle) * dist;
          const size = textSize * 0.1 * (1 - progress * 2);
          
          if (size > 0) {
            ctx.fillStyle = i % 2 === 0 ? '#FFFF00' : '#FF5500';
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    } else if (text.isPlayer) {
      // Player taking damage - red text
      ctx.fillStyle = '#FF5555';
      ctx.fillText(text.value.toString(), text.x, text.y + yOffset);
    } else {
      // Normal enemy damage - white text with slight pulse
      const pulseAmount = 1 + Math.sin(text.currentFrame * 0.4) * 0.1;
      ctx.fillStyle = '#FFFF00';
      
      // Scale text slightly based on pulse for subtle animation
      ctx.setTransform(pulseAmount, 0, 0, pulseAmount, text.x, text.y + yOffset);
      ctx.fillText(text.value.toString(), 0, 0);
    }
    
    ctx.restore();
  };

    

  
  // Apply enhanced fire aura with improved visuals
  export const drawEnhancedFireAura = (ctx, x, y, radius, time) => {
    ctx.save();
    
    // Animation time
    const animTime = time * 0.001;
    
    // Create layered effect for more realistic fire aura
    
    // Outer glow layer
    const outerGradient = ctx.createRadialGradient(
      x, y, radius * 0.4,
      x, y, radius
    );
    outerGradient.addColorStop(0, 'rgba(255, 100, 0, 0.0)');
    outerGradient.addColorStop(0.5, 'rgba(255, 80, 0, 0.1)');
    outerGradient.addColorStop(0.8, 'rgba(200, 60, 0, 0.2)');
    outerGradient.addColorStop(1, 'rgba(150, 30, 0, 0)');
    
    ctx.fillStyle = outerGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Middle intensity layer with distortion
    const midGradient = ctx.createRadialGradient(
      x, y, 0,
      x, y, radius * 0.8
    );
    midGradient.addColorStop(0, 'rgba(255, 200, 50, 0.3)');
    midGradient.addColorStop(0.4, 'rgba(255, 150, 0, 0.25)');
    midGradient.addColorStop(0.8, 'rgba(255, 70, 0, 0.1)');
    midGradient.addColorStop(1, 'rgba(200, 40, 0, 0)');
    
    ctx.fillStyle = midGradient;
    
    // Create distorted circle for fire effect
    ctx.beginPath();
    
    const distortPoints = 12;
    const innerRadius = radius * 0.7;
    
    for (let i = 0; i <= distortPoints; i++) {
      const angle = (i / distortPoints) * Math.PI * 2;
      
      // Add pulsing distortion based on time
      const distort = 1 + Math.sin(animTime * 3 + i * 2) * 0.1;
      const currRadius = innerRadius * distort;
      
      const px = x + Math.cos(angle) * currRadius;
      const py = y + Math.sin(angle) * currRadius;
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Inner bright core
    const coreGradient = ctx.createRadialGradient(
      x, y, 0,
      x, y, radius * 0.4
    );
    coreGradient.addColorStop(0, 'rgba(255, 255, 150, 0.3)');
    coreGradient.addColorStop(0.5, 'rgba(255, 200, 50, 0.2)');
    coreGradient.addColorStop(1, 'rgba(255, 150, 0, 0)');
    
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Add flame particles around perimeter
    for (let i = 0; i < 12; i++) {
      // Angle with time-based offset for rotation
      const angle = animTime + i * Math.PI / 6;
      
      // Fluctuating radius
      const flameRadius = radius * (0.7 + Math.sin(animTime * 2 + i) * 0.2);
      
      // Position on perimeter
      const fx = x + Math.cos(angle) * flameRadius;
      const fy = y + Math.sin(angle) * flameRadius;
      
      // Flame size variations
      const flameHeight = radius * 0.25 * (0.7 + Math.sin(animTime * 3 + i * 2) * 0.3);
      const flameWidth = flameHeight * 0.6;
      
      // Flame direction is outward from center
      const flameAngle = angle;
      
      // Draw flame
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(flameAngle);
      
      // Flame gradient
      const flameGradient = ctx.createLinearGradient(0, -flameHeight, 0, flameHeight * 0.3);
      
      // Alternate flame colors for variety
      if (i % 3 === 0) {
        flameGradient.addColorStop(0, 'rgba(255, 255, 100, 0.7)');
        flameGradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.5)');
        flameGradient.addColorStop(1, 'rgba(200, 50, 0, 0)');
      } else if (i % 3 === 1) {
        flameGradient.addColorStop(0, 'rgba(255, 200, 50, 0.7)');
        flameGradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.5)');
        flameGradient.addColorStop(1, 'rgba(200, 30, 0, 0)');
      } else {
        flameGradient.addColorStop(0, 'rgba(255, 150, 0, 0.7)');
        flameGradient.addColorStop(0.5, 'rgba(255, 70, 0, 0.5)');
        flameGradient.addColorStop(1, 'rgba(180, 20, 0, 0)');
      }
      
      ctx.fillStyle = flameGradient;
      
      // Draw flame shape
      ctx.beginPath();
      ctx.moveTo(0, -flameHeight);
      ctx.quadraticCurveTo(
        flameWidth, -flameHeight * 0.3,
        0, flameHeight * 0.3
      );
      ctx.quadraticCurveTo(
        -flameWidth, -flameHeight * 0.3,
        0, -flameHeight
      );
      ctx.fill();
      
      // Add small bright tip
      ctx.fillStyle = 'rgba(255, 255, 200, 0.6)';
      ctx.beginPath();
      ctx.arc(0, -flameHeight * 0.8, flameWidth * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
    
    // Add small flickering embers
    const emberCount = 15;
    for (let i = 0; i < emberCount; i++) {
      // Animate position with time
      const angle = animTime * (i % 3 + 1) * 0.5 + i;
      const emberDist = radius * (0.2 + Math.random() * 0.7);
      
      const emberX = x + Math.cos(angle) * emberDist;
      const emberY = y + Math.sin(angle) * emberDist;
      
      // Size and opacity based on time and position
      const emberSize = radius * 0.03 * (0.5 + Math.sin(animTime * 5 + i) * 0.5);
      const emberOpacity = 0.4 + Math.sin(animTime * 3 + i * 2) * 0.3;
      
      // Draw ember
      ctx.fillStyle = `rgba(255, 200, 50, ${emberOpacity})`;
      ctx.beginPath();
      ctx.arc(emberX, emberY, emberSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };
  
  // Add enhancement for hit animation on enemies
  export const createEnemyHitEffect = (enemy, isCritical = false) => {
    // Return an object with animation data
    return {
      startTime: Date.now(),
      duration: isCritical ? 300 : 150, // longer flash for criticals
      color: isCritical ? '#FF0000' : '#FFFFFF',
      flashIntensity: isCritical ? 0.7 : 0.5
    };
  };




// Draw enhanced frost effect
export const drawFrostEffect = (ctx, x, y, radius, time) => {
  ctx.save();
  
  // Animation time
  const animTime = time * 0.001;
  
  // Create frost effect gradient
  const gradient = ctx.createRadialGradient(
    x, y, radius * 0.2,
    x, y, radius
  );
  gradient.addColorStop(0, 'rgba(150, 240, 255, 0.4)');
  gradient.addColorStop(0.6, 'rgba(100, 210, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(50, 180, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Add crystalline patterns
  const crystalCount = 6;
  for (let i = 0; i < crystalCount; i++) {
    const angle = (i / crystalCount) * Math.PI * 2 + animTime * 0.5;
    const distance = radius * 0.6;
    const crystalX = x + Math.cos(angle) * distance;
    const crystalY = y + Math.sin(angle) * distance;
    
    // Draw a snowflake-like pattern
    ctx.strokeStyle = 'rgba(200, 240, 255, 0.7)';
    ctx.lineWidth = 2;
    
    const rayLength = radius * 0.25;
    
    // Draw six rays
    for (let j = 0; j < 6; j++) {
      const rayAngle = (j / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(crystalX, crystalY);
      ctx.lineTo(
        crystalX + Math.cos(rayAngle) * rayLength,
        crystalY + Math.sin(rayAngle) * rayLength
      );
      ctx.stroke();
    }
  }
  
  // Add some floating ice particles
  const particleCount = 12;
  for (let i = 0; i < particleCount; i++) {
    const angle = animTime * 0.7 + i * (Math.PI * 2 / particleCount);
    const dist = radius * (0.3 + Math.sin(animTime + i) * 0.3);
    const particleX = x + Math.cos(angle) * dist;
    const particleY = y + Math.sin(angle) * dist;
    
    ctx.fillStyle = 'rgba(200, 250, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(particleX, particleY, 1 + Math.sin(animTime * 2 + i) * 1, 0, Math.PI * 2);
    ctx.fill();
  }
  
// Add central swirl effect
ctx.strokeStyle = 'rgba(150, 230, 255, 0.5)';
ctx.lineWidth = 1;
ctx.beginPath();
const spiralPoints = 30;
let lastX = null, lastY = null;

for (let i = 0; i < spiralPoints; i++) {
  const spiralProgress = i / spiralPoints;
  const spiralAngle = spiralProgress * Math.PI * 6 + animTime * 2;
  const spiralRadius = spiralProgress * radius * 0.4;
  const spiralX = x + Math.cos(spiralAngle) * spiralRadius;
  const spiralY = y + Math.sin(spiralAngle) * spiralRadius;
  
  if (i === 0) {
    ctx.moveTo(spiralX, spiralY);
  } else {
    ctx.lineTo(spiralX, spiralY);
  }
  
  lastX = spiralX;
  lastY = spiralY;
}
ctx.stroke();

ctx.restore();
};

// Draw lightning effect
export const drawLightningEffect = (ctx, startX, startY, endX, endY, time, width = 2) => {
ctx.save();

// Animation time
const animTime = time * 0.001;

// Create zigzag pattern
const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
const segments = Math.floor(distance / 10);

// Draw multiple layers for a thicker, glowing effect
for (let layer = 0; layer < 3; layer++) {
  const layerWidth = width * (3 - layer);
  const alpha = layer === 0 ? 0.8 : layer === 1 ? 0.5 : 0.2;
  
  ctx.strokeStyle = `rgba(180, 150, 255, ${alpha})`;
  ctx.lineWidth = layerWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  
  // Create lightning bolt segments with randomization
  for (let i = 1; i < segments; i++) {
    const progress = i / segments;
    
    // Random offset based on segment position and animation time
    const rand = Math.sin(progress * 10 + animTime * 5) * 0.5 + 0.5;
    const offset = (Math.random() - 0.5) * 15 * rand;
    
    // Position along straight line + offset
    const x = startX + (endX - startX) * progress + offset;
    const y = startY + (endY - startY) * progress + offset;
    
    ctx.lineTo(x, y);
  }
  
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

// Add glow around the lightning
const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
gradient.addColorStop(0, 'rgba(180, 150, 255, 0.3)');
gradient.addColorStop(0.5, 'rgba(200, 180, 255, 0.4)');
gradient.addColorStop(1, 'rgba(180, 150, 255, 0.3)');

ctx.shadowColor = 'rgba(180, 150, 255, 0.8)';
ctx.shadowBlur = 10;
ctx.strokeStyle = gradient;
ctx.lineWidth = width;
ctx.stroke();

ctx.restore();
};

// Draw lightning ball for impact visual
export const drawLightningImpact = (ctx, x, y, radius, time) => {
ctx.save();

// Animation time
const animTime = time * 0.001;

// Create pulsing effect
const pulseRadius = radius * (1 + Math.sin(animTime * 5) * 0.2);

// Outer glow
const outerGlow = ctx.createRadialGradient(
  x, y, pulseRadius * 0.2,
  x, y, pulseRadius
);
outerGlow.addColorStop(0, 'rgba(200, 180, 255, 0.7)');
outerGlow.addColorStop(0.5, 'rgba(180, 150, 255, 0.5)');
outerGlow.addColorStop(1, 'rgba(160, 120, 255, 0)');

ctx.fillStyle = outerGlow;
ctx.beginPath();
ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
ctx.fill();

// Inner core with electric texture
const innerRadius = pulseRadius * 0.5;
const core = ctx.createRadialGradient(
  x, y, 0,
  x, y, innerRadius
);
core.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
core.addColorStop(0.5, 'rgba(200, 180, 255, 0.7)');
core.addColorStop(1, 'rgba(180, 150, 255, 0.5)');

ctx.fillStyle = core;
ctx.beginPath();
ctx.arc(x, y, innerRadius, 0, Math.PI * 2);
ctx.fill();

// Add electric arcs
const arcCount = 6;
for (let i = 0; i < arcCount; i++) {
  const angle = (i / arcCount) * Math.PI * 2 + animTime * 3;
  const arcLength = pulseRadius * 1.2;
  const startDistance = innerRadius * 0.8;
  
  const startX = x + Math.cos(angle) * startDistance;
  const startY = y + Math.sin(angle) * startDistance;
  const endX = x + Math.cos(angle) * arcLength;
  const endY = y + Math.sin(angle) * arcLength;
  
  drawLightningEffect(ctx, startX, startY, endX, endY, time, 1);
}

ctx.restore();
};

// Enhance the original drawEnhancedProjectile function to support frost
export const drawEnhancedProjectile = (ctx, projectile, type, time) => {
ctx.save();

// Animation time for effects
const animTime = time * 0.001;

if (type === 'wand') {
  // Get the wand level from the projectile if available
  const wandLevel = projectile.level || 1;
  
  // Draw magical projectile trail
  if (projectile.trailPositions) {
    for (let i = 0; i < projectile.trailPositions.length; i++) {
      const pos = projectile.trailPositions[i];
      const alpha = 0.6 * (1 - i / projectile.trailPositions.length);
      const size = projectile.radius * (1 - i / projectile.trailPositions.length) * 1.2;
      
      // Trail gradient - change color based on wand level
      let trailColor1, trailColor2, trailColor3;
      
      if (wandLevel === 1) {
        trailColor1 = `rgba(0, 255, 255, ${alpha})`;
        trailColor2 = `rgba(0, 200, 255, ${alpha * 0.6})`;
        trailColor3 = `rgba(0, 150, 255, 0)`;
      } else if (wandLevel === 2) {
        // Wand level 2 - purple hues
        trailColor1 = `rgba(180, 100, 255, ${alpha})`;
        trailColor2 = `rgba(150, 50, 255, ${alpha * 0.6})`;
        trailColor3 = `rgba(120, 0, 255, 0)`;
      } else {
        // Wand level 3 - golden hues
        trailColor1 = `rgba(255, 220, 100, ${alpha})`;
        trailColor2 = `rgba(255, 180, 50, ${alpha * 0.6})`;
        trailColor3 = `rgba(255, 150, 0, 0)`;
      }
      
      const gradient = ctx.createRadialGradient(
        pos.x, pos.y, 0,
        pos.x, pos.y, size
      );
      gradient.addColorStop(0, trailColor1);
      gradient.addColorStop(0.6, trailColor2);
      gradient.addColorStop(1, trailColor3);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Draw magical projectile with improved glowing effect
  const pulseSize = 1 + Math.sin(animTime * 4 + projectile.distanceTraveled * 0.01) * 0.15;
  
  // Choose colors based on wand level
  let coreColor, midColor, outerColor, innerColor;
  
  if (wandLevel === 1) {
    // Level 1 - blue
    coreColor = 'rgba(40, 255, 255, 1)';
    midColor = 'rgba(0, 200, 255, 0.8)';
    outerColor = 'rgba(0, 150, 255, 0.4)';
    innerColor = 'white';
  } else if (wandLevel === 2) {
    // Level 2 - purple
    coreColor = 'rgba(180, 100, 255, 1)';
    midColor = 'rgba(150, 50, 255, 0.8)';
    outerColor = 'rgba(120, 0, 255, 0.4)';
    innerColor = 'rgba(220, 200, 255, 0.9)';
  } else {
    // Level 3 - gold
    coreColor = 'rgba(255, 220, 100, 1)';
    midColor = 'rgba(255, 180, 50, 0.8)';
    outerColor = 'rgba(255, 150, 0, 0.4)';
    innerColor = 'rgba(255, 255, 200, 0.9)';
  }
  
  const gradient = ctx.createRadialGradient(
    projectile.x, projectile.y, 0,
    projectile.x, projectile.y, projectile.radius * pulseSize * 1.8
  );
  gradient.addColorStop(0, coreColor);
  gradient.addColorStop(0.4, midColor);
  gradient.addColorStop(0.7, outerColor);
  gradient.addColorStop(1, `rgba(0, 100, 255, 0)`);
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, projectile.radius * pulseSize * 1.8, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner core with more detail
  const coreGradient = ctx.createRadialGradient(
    projectile.x, projectile.y, 0,
    projectile.x, projectile.y, projectile.radius * pulseSize * 0.6
  );
  coreGradient.addColorStop(0, innerColor);
  coreGradient.addColorStop(0.7, 'rgba(200, 255, 255, 0.9)');
  coreGradient.addColorStop(1, midColor);
  
  ctx.fillStyle = coreGradient;
  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, projectile.radius * pulseSize * 0.6, 0, Math.PI * 2);
  ctx.fill();
  
  // Add additional effects for higher level wands
  if (wandLevel >= 2) {
    // Add magical rune symbols that rotate
    const runeCount = wandLevel === 3 ? 4 : 2;
    
    for (let i = 0; i < runeCount; i++) {
      const runeAngle = animTime * 2 + i * (Math.PI * 2 / runeCount);
      const runeDistance = projectile.radius * pulseSize * 0.9;
      const runeX = projectile.x + Math.cos(runeAngle) * runeDistance;
      const runeY = projectile.y + Math.sin(runeAngle) * runeDistance;
      const runeSize = projectile.radius * 0.3;
      
      ctx.save();
      ctx.translate(runeX, runeY);
      ctx.rotate(runeAngle + animTime);
      
      // Draw rune symbol - different for each level
      ctx.fillStyle = wandLevel === 2 ? 'rgba(180, 100, 255, 0.7)' : 'rgba(255, 220, 100, 0.7)';
      
      if (wandLevel === 2) {
        // Triangle runes for level 2
        ctx.beginPath();
        ctx.moveTo(0, -runeSize);
        ctx.lineTo(runeSize * 0.866, runeSize * 0.5);
        ctx.lineTo(-runeSize * 0.866, runeSize * 0.5);
        ctx.closePath();
        ctx.fill();
      } else {
        // Star runes for level 3
        const points = 5;
        const innerRadius = runeSize * 0.5;
        
        ctx.beginPath();
        for (let j = 0; j < points * 2; j++) {
          const radius = j % 2 === 0 ? runeSize : innerRadius;
          const pointAngle = (j * Math.PI) / points;
          const px = Math.cos(pointAngle) * radius;
          const py = Math.sin(pointAngle) * radius;
          
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.restore();
    }
  }
  
  // Add energy particles for level 3
  if (wandLevel === 3) {
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const angle = animTime * 3 + i * (Math.PI * 2 / particleCount);
      const distance = projectile.radius * pulseSize * (1.3 + Math.sin(animTime * 5 + i) * 0.2);
      const particleX = projectile.x + Math.cos(angle) * distance;
      const particleY = projectile.y + Math.sin(angle) * distance;
      
      ctx.fillStyle = 'rgba(255, 220, 100, 0.7)';
      ctx.beginPath();
      ctx.arc(particleX, particleY, 1 + Math.sin(animTime * 3 + i) * 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
} else if (type === 'axe') {
  // Axe projectile code (unchanged)
// Translate to center and rotate
ctx.translate(projectile.x, projectile.y);
ctx.rotate(projectile.rotation);

// Draw axe handle with more visible colors
ctx.fillStyle = '#FF4500'; // Bright orange for handle
ctx.fillRect(-projectile.width / 2, -projectile.height / 4, projectile.width, projectile.height / 2);

// Draw axe heads with more visible colors
ctx.fillStyle = '#FF0000'; // Bright red for heads

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

// Add shine for better visibility
ctx.strokeStyle = 'white';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(projectile.width / 2, -projectile.height / 6);
ctx.lineTo(projectile.width / 2 + projectile.width / 4, -projectile.height / 3);
ctx.stroke();

  
} else if (type === 'frost') {
  // Frost projectile
  
  // Draw frost trail
  if (projectile.trailPositions) {
    for (let i = 0; i < projectile.trailPositions.length; i++) {
      const pos = projectile.trailPositions[i];
      const alpha = 0.5 * (1 - i / projectile.trailPositions.length);
      const size = projectile.radius * (1 - i / projectile.trailPositions.length) * 1.2;
      
      // Trail gradient with ice color
      const gradient = ctx.createRadialGradient(
        pos.x, pos.y, 0,
        pos.x, pos.y, size
      );
      gradient.addColorStop(0, `rgba(150, 240, 255, ${alpha})`);
      gradient.addColorStop(0.6, `rgba(100, 210, 255, ${alpha * 0.6})`);
      gradient.addColorStop(1, `rgba(50, 180, 255, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Main frost projectile
  const pulseSize = 1 + Math.sin(animTime * 3 + projectile.distanceTraveled * 0.01) * 0.2;
  
  // Outer glow
  const outerGradient = ctx.createRadialGradient(
    projectile.x, projectile.y, 0,
    projectile.x, projectile.y, projectile.radius * pulseSize * 2
  );
  outerGradient.addColorStop(0, 'rgba(150, 240, 255, 0.8)');
  outerGradient.addColorStop(0.5, 'rgba(100, 210, 255, 0.5)');
  outerGradient.addColorStop(1, 'rgba(50, 180, 255, 0)');
  
  ctx.fillStyle = outerGradient;
  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, projectile.radius * pulseSize * 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner core - snowflake pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, projectile.radius * pulseSize * 0.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw snowflake arms
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 2;
  
  const armCount = 6;
  const armLength = projectile.radius * pulseSize;
  
  for (let i = 0; i < armCount; i++) {
    const angle = (i / armCount) * Math.PI * 2 + projectile.distanceTraveled * 0.01;
    
    ctx.beginPath();
    ctx.moveTo(projectile.x, projectile.y);
    ctx.lineTo(
      projectile.x + Math.cos(angle) * armLength,
      projectile.y + Math.sin(angle) * armLength
    );
    ctx.stroke();
    
    // Add small branches to each arm
    const branchLength = armLength * 0.4;
    const branchStart = armLength * 0.5;
    
    // First branch
    ctx.beginPath();
    ctx.moveTo(
      projectile.x + Math.cos(angle) * branchStart,
      projectile.y + Math.sin(angle) * branchStart
    );
    ctx.lineTo(
      projectile.x + Math.cos(angle) * branchStart + Math.cos(angle + Math.PI/3) * branchLength,
      projectile.y + Math.sin(angle) * branchStart + Math.sin(angle + Math.PI/3) * branchLength
    );
    ctx.stroke();
    
    // Second branch
    ctx.beginPath();
    ctx.moveTo(
      projectile.x + Math.cos(angle) * branchStart,
      projectile.y + Math.sin(angle) * branchStart
    );
    ctx.lineTo(
      projectile.x + Math.cos(angle) * branchStart + Math.cos(angle - Math.PI/3) * branchLength,
      projectile.y + Math.sin(angle) * branchStart + Math.sin(angle - Math.PI/3) * branchLength
    );
    ctx.stroke();
  }
  
  // Small ice particle effect
  for (let i = 0; i < 3; i++) {
    const angle = animTime * 5 + i * Math.PI * 2 / 3;
    const distance = projectile.radius * (0.8 + Math.sin(animTime * 4 + i) * 0.2);
    
    ctx.fillStyle = 'rgba(200, 250, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(
      projectile.x + Math.cos(angle) * distance,
      projectile.y + Math.sin(angle) * distance,
      1 + Math.random() * 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

ctx.restore();
};

// Update the original drawEnhancedHitEffect function to support frost/lightning
export const drawEnhancedHitEffect = (ctx, effect) => {
ctx.save();

// Calculate progress ratio
const progress = effect.currentFrame / effect.duration;

// Fade out gradually for all effects
ctx.globalAlpha = 1 - progress;

if (effect.type === 'hit') {
  // Check color to determine type of hit effect
  
  if (effect.color.includes('0, 200, 255')) {
    // Magic hit effect - arcane burst
    // ... existing magic hit code ...
    
  } else if (effect.color.includes('255, 100, 0')) {
    // Axe hit effect - fiery impact
    // ... existing axe hit code ...
    
  } else if (effect.color.includes('100, 200, 255') || effect.color.includes('100, 210, 255')) {
    // Frost hit effect - ice crystals
    
    // Outer ripple
    const outerRadius = effect.size * progress * 2.5;
    const rippleGradient = ctx.createRadialGradient(
      effect.x, effect.y, 0,
      effect.x, effect.y, outerRadius
    );
    rippleGradient.addColorStop(0, 'rgba(150, 240, 255, 0)');
    rippleGradient.addColorStop(0.7, 'rgba(100, 210, 255, 0.3)');
    rippleGradient.addColorStop(0.9, 'rgba(50, 180, 255, 0.2)');
    rippleGradient.addColorStop(1, 'rgba(50, 180, 255, 0)');
    
    ctx.fillStyle = rippleGradient;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, outerRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner bright flash
    const innerRadius = effect.size * (1 - progress * 0.6);
    const innerGradient = ctx.createRadialGradient(
      effect.x, effect.y, 0,
      effect.x, effect.y, innerRadius
    );
    innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    innerGradient.addColorStop(0.4, 'rgba(150, 240, 255, 0.7)');
    innerGradient.addColorStop(0.8, 'rgba(100, 210, 255, 0.3)');
    innerGradient.addColorStop(1, 'rgba(50, 180, 255, 0)');
    
    ctx.fillStyle = innerGradient;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, innerRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Ice crystal fragments
    const crystalCount = 8;
    for (let i = 0; i < crystalCount; i++) {
      const angle = Math.PI * 2 * i / crystalCount + progress * Math.PI;
      const distance = effect.size * progress * 3;
      
      // Draw crystal shard
      ctx.fillStyle = 'rgba(200, 250, 255, 0.7)';
      
      // Create diamond/crystal shape
      ctx.save();
      ctx.translate(
        effect.x + Math.cos(angle) * distance,
        effect.y + Math.sin(angle) * distance
      );
      ctx.rotate(angle);
      
      const crystalSize = effect.size * 0.3 * (1 - progress);
      
      ctx.beginPath();
      ctx.moveTo(0, -crystalSize);
      ctx.lineTo(crystalSize/2, 0);
      ctx.lineTo(0, crystalSize);
      ctx.lineTo(-crystalSize/2, 0);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
    
  } else if (effect.color.includes('180, 100, 255') || effect.color.includes('180, 150, 255')) {
    // Lightning hit effect
    
    // Lightning impact shockwave
    const outerRadius = effect.size * progress * 3;
    const shockwaveGradient = ctx.createRadialGradient(
      effect.x, effect.y, 0,
      effect.x, effect.y, outerRadius
    );
    shockwaveGradient.addColorStop(0, 'rgba(200, 180, 255, 0)');
    shockwaveGradient.addColorStop(0.5, 'rgba(180, 150, 255, 0.3)');
    shockwaveGradient.addColorStop(0.8, 'rgba(160, 100, 255, 0.2)');
    shockwaveGradient.addColorStop(1, 'rgba(140, 80, 255, 0)');
    
    ctx.fillStyle = shockwaveGradient;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, outerRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Electric pulse rings
    ctx.strokeStyle = 'rgba(180, 150, 255, 0.6)';
    ctx.lineWidth = 2 * (1 - progress);
    
    for (let i = 0; i < 3; i++) {
      const ringProgress = Math.min(1, progress * 3 - i * 0.3);
      if (ringProgress <= 0) continue;
      
      const ringRadius = effect.size * ringProgress * 1.5;
      ctx.globalAlpha = (1 - ringProgress) * (1 - progress) * 0.8;
      
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Electric arcs
    const arcCount = 8;
    for (let i = 0; i < arcCount; i++) {
      if (progress > 0.7) continue; // Only show during first part of animation
      
      const angle = Math.PI * 2 * i / arcCount;
      const innerDist = effect.size * 0.3;
      const outerDist = effect.size * (0.5 + progress);
      
      const startX = effect.x + Math.cos(angle) * innerDist;
      const startY = effect.y + Math.sin(angle) * innerDist;
      const endX = effect.x + Math.cos(angle) * outerDist;
      const endY = effect.y + Math.sin(angle) * outerDist;
      
      // Draw lightning arc
      ctx.strokeStyle = 'rgba(230, 200, 255, 0.8)';
      ctx.lineWidth = 2 * (1 - progress);
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      // Create zigzag for lightning effect
      const segments = 4;
      for (let j = 1; j < segments; j++) {
        const segmentProgress = j / segments;
        const segX = startX + (endX - startX) * segmentProgress;
        const segY = startY + (endY - startY) * segmentProgress;
        
        // Add random offset
        const offsetMagnitude = 5 * (1 - progress) * (1 - segmentProgress);
        const offsetX = (Math.random() - 0.5) * offsetMagnitude;
        const offsetY = (Math.random() - 0.5) * offsetMagnitude;
        
        ctx.lineTo(segX + offsetX, segY + offsetY);
      }
      
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    // Central flash
    if (progress < 0.5) {
      const flashGradient = ctx.createRadialGradient(
        effect.x, effect.y, 0,
        effect.x, effect.y, effect.size * 0.7 * (1 - progress * 2)
      );
      flashGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      flashGradient.addColorStop(0.5, 'rgba(200, 180, 255, 0.7)');
      flashGradient.addColorStop(1, 'rgba(180, 150, 255, 0)');
      
      ctx.fillStyle = flashGradient;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.size * 0.7 * (1 - progress * 2), 0, Math.PI * 2);
      ctx.fill();
    }
  }
} else if (effect.type === 'particle') {
  // Generic particle effect with enhanced visuals
  // ... existing particle code ...
}

ctx.restore();
};









  
  // Draw enemy with hit animation
  export const drawEnemyWithHitEffects = (ctx, enemy, direction, frame, color, hitEffect = null) => {
    ctx.save();
    
    // If hit effect is active, apply flash
    if (hitEffect) {
      const elapsedTime = Date.now() - hitEffect.startTime;
      const progress = Math.min(1, elapsedTime / hitEffect.duration);
      
      // Flash effect fades out over time
      const flashAlpha = (1 - progress) * hitEffect.flashIntensity;
      
      // Draw flash silhouette
      if (flashAlpha > 0) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
        
        // Draw silhouette based on enemy type
        // For simplicity, just use rectangles for the body and head
        const headSize = enemy.width * 0.6;
        const bodyWidth = enemy.width * 0.8;
        const bodyHeight = enemy.height * 0.6;
        
        // Body position
        const bodyX = enemy.x + (enemy.width - bodyWidth) / 2;
        const bodyY = enemy.y + enemy.height - bodyHeight - 5;
        
        // Body
        ctx.fillRect(bodyX, bodyY, bodyWidth, bodyHeight);
        
        // Head
        const headX = enemy.x + (enemy.width - headSize) / 2;
        const headY = enemy.y + enemy.height - bodyHeight - headSize - 2;
        ctx.fillRect(headX, headY, headSize, headSize);
        
        // Additional hit particles for critical hits
        if (hitEffect.color === '#FF0000') {
          const particleCount = 8;
          for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = enemy.width * 0.7 * Math.random();
            const px = enemy.x + enemy.width/2 + Math.cos(angle) * distance;
            const py = enemy.y + enemy.height/2 + Math.sin(angle) * distance;
            const size = 1 + Math.random() * 3;
            
            ctx.fillStyle = Math.random() > 0.5 ? '#FF5555' : '#FFAAAA';
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    
    // Reset composite operation before drawing the enemy
    ctx.globalCompositeOperation = 'source-over';
    
    // Now draw the enemy normally - default to standard drawCharacter or custom renderer
    // The original drawCharacter call would go here
    
    ctx.restore();
  };