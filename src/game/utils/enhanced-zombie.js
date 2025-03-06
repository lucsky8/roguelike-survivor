// Enhanced zombie enemy renderer
export const drawEnhancedZombie = (ctx, x, y, width, height, direction, frame, enemy = null) => {
    // Check if the zombie is being hit
    const isHit = enemy && enemy.isHit && (Date.now() - enemy.hitTime < enemy.hitDuration);
    const isCriticalHit = isHit && enemy.hitDuration >= 300;
  
    ctx.save();
    
    // Apply hit effect if zombie is being hit
    if (isHit) {
      ctx.globalCompositeOperation = 'lighter';
      if (isCriticalHit) {
        // Critical hits have a stronger red glow
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 15;
      } else {
        // Regular hits have a white flash
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
      }
    }
    
    // Zombie properties
    const headSize = width * 0.7;
    const bodyWidth = width * 0.9;
    const bodyHeight = height * 0.6;
    
    // Position calculations
    const shambleOffset = Math.sin(frame * 0.3) * 3; // Shambling animation
    const bodyX = x + (width - bodyWidth) / 2;
    const bodyY = y + height - bodyHeight - 5 + (shambleOffset * 0.5);
    const headX = x + (width - headSize) / 2;
    const headY = y + height - bodyHeight - headSize - 2 + (shambleOffset * 0.5);
    
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
    
    // Draw legs with shambling animation
    const legWidth = bodyWidth * 0.3;
    const legHeight = height * 0.3;
    
    // Left leg with more pronounced shamble
    const leftLegOffset = Math.sin(frame * 0.3) * 7;
    ctx.fillStyle = '#3d6e3d'; // Darker green for pants
    ctx.fillRect(
      bodyX + bodyWidth * 0.25 - legWidth / 2,
      bodyY + bodyHeight - 2,
      legWidth,
      legHeight + leftLegOffset
    );
    
    // Right leg with opposite shamble
    const rightLegOffset = Math.sin(frame * 0.3 + Math.PI) * 7;
    ctx.fillRect(
      bodyX + bodyWidth * 0.75 - legWidth / 2,
      bodyY + bodyHeight - 2,
      legWidth,
      legHeight + rightLegOffset
    );
    
    // Add torn pants details
    ctx.strokeStyle = '#2a4a2a'; // Even darker green for tears
    ctx.lineWidth = 2;
    
    // Left leg tears
    const tearY1 = bodyY + bodyHeight + legHeight * 0.3 + leftLegOffset;
    ctx.beginPath();
    ctx.moveTo(bodyX + bodyWidth * 0.25 - legWidth / 2, tearY1);
    ctx.lineTo(bodyX + bodyWidth * 0.25, tearY1);
    ctx.stroke();
    
    // Right leg tears
    const tearY2 = bodyY + bodyHeight + legHeight * 0.4 + rightLegOffset;
    ctx.beginPath();
    ctx.moveTo(bodyX + bodyWidth * 0.75, tearY2);
    ctx.lineTo(bodyX + bodyWidth * 0.75 + legWidth / 2, tearY2);
    ctx.stroke();
    
    // Draw worn-out shoes
    ctx.fillStyle = '#4a3728'; // Brown for shoes
    ctx.fillRect(
      bodyX + bodyWidth * 0.25 - legWidth / 2 - 2,
      bodyY + bodyHeight + legHeight - 8 + leftLegOffset,
      legWidth + 4,
      8
    );
    ctx.fillRect(
      bodyX + bodyWidth * 0.75 - legWidth / 2 - 2,
      bodyY + bodyHeight + legHeight - 8 + rightLegOffset,
      legWidth + 4,
      8
    );
    
    // Draw torso
    // Create gradient for a more detailed zombie body with rotting look
    const torsoGradient = ctx.createLinearGradient(
      bodyX, bodyY,
      bodyX + bodyWidth, bodyY + bodyHeight
    );
    torsoGradient.addColorStop(0, '#5cb85c'); // Base zombie green
    torsoGradient.addColorStop(0.4, '#4a994a'); // Mid green
    torsoGradient.addColorStop(0.7, '#3d8b3d'); // Darker green
    torsoGradient.addColorStop(1, '#367d36'); // Even darker green
    
    ctx.fillStyle = torsoGradient;
    ctx.fillRect(bodyX, bodyY, bodyWidth, bodyHeight);
    
    // Add torn shirt details
    ctx.strokeStyle = '#2a602a'; // Very dark green
    ctx.lineWidth = 2;
    
    // Horizontal tears across chest
    for (let i = 0; i < 2; i++) {
      const tearY = bodyY + bodyHeight * (0.3 + i * 0.3);
      const tearLength = bodyWidth * 0.4;
      const tearStart = bodyX + bodyWidth * (0.3 + Math.random() * 0.1);
      
      ctx.beginPath();
      ctx.moveTo(tearStart, tearY);
      ctx.lineTo(tearStart + tearLength, tearY + (Math.random() - 0.5) * 5);
      ctx.stroke();
    }
    
    // Arms with shambling animation based on direction
    const armWidth = legWidth * 0.9;
    const armHeight = bodyHeight * 0.7;
    
    // Direction-specific arm drawing
    if (direction === 'left' || direction === 'right') {
      // Arms for left/right movement
      if (direction === 'right') {
        const armOffset = Math.sin(frame * 0.2) * 5; // More pronounced shamble
        
        // Extended, droopy arm - right facing
        ctx.save();
        ctx.translate(bodyX + bodyWidth, bodyY + bodyHeight * 0.3);
        ctx.rotate(Math.PI * 0.1 + Math.sin(frame * 0.15) * 0.1); // Slight rotation
        
        ctx.fillStyle = '#5cb85c';
        ctx.fillRect(0, 0, armWidth + 5, armHeight);
        
        // Torn flesh on arm
        ctx.strokeStyle = '#2a602a';
        ctx.beginPath();
        ctx.moveTo(armWidth * 0.5, armHeight * 0.3);
        ctx.lineTo(armWidth * 0.8, armHeight * 0.3);
        ctx.stroke();
        
        ctx.restore();
      } else {
        // Extended, droopy arm - left facing
        ctx.save();
        ctx.translate(bodyX - armWidth, bodyY + bodyHeight * 0.3);
        ctx.rotate(-Math.PI * 0.1 - Math.sin(frame * 0.15) * 0.1); // Slight rotation
        
        ctx.fillStyle = '#5cb85c';
        ctx.fillRect(0, 0, armWidth + 5, armHeight);
        
        // Torn flesh on arm
        ctx.strokeStyle = '#2a602a';
        ctx.beginPath();
        ctx.moveTo(armWidth * 0.2, armHeight * 0.4);
        ctx.lineTo(armWidth * 0.5, armHeight * 0.4);
        ctx.stroke();
        
        ctx.restore();
      }
    } else {
      // Both arms visible for up/down
      const leftArmOffset = Math.sin(frame * 0.3) * 5;
      const rightArmOffset = Math.sin(frame * 0.3 + Math.PI) * 5;
      
      // Custom shape for droopy left arm
      ctx.fillStyle = '#5cb85c';
      ctx.beginPath();
      ctx.moveTo(bodyX, bodyY + bodyHeight * 0.3);
      ctx.lineTo(bodyX - armWidth, bodyY + bodyHeight * 0.3 + leftArmOffset + armHeight * 0.4);
      ctx.lineTo(bodyX - armWidth, bodyY + bodyHeight * 0.3 + leftArmOffset + armHeight);
      ctx.lineTo(bodyX - armWidth * 0.2, bodyY + bodyHeight * 0.3 + armHeight * 0.8);
      ctx.lineTo(bodyX, bodyY + bodyHeight * 0.7);
      ctx.closePath();
      ctx.fill();
      
      // Custom shape for droopy right arm
      ctx.beginPath();
      ctx.moveTo(bodyX + bodyWidth, bodyY + bodyHeight * 0.3);
      ctx.lineTo(bodyX + bodyWidth + armWidth, bodyY + bodyHeight * 0.3 + rightArmOffset + armHeight * 0.4);
      ctx.lineTo(bodyX + bodyWidth + armWidth, bodyY + bodyHeight * 0.3 + rightArmOffset + armHeight);
      ctx.lineTo(bodyX + bodyWidth + armWidth * 0.2, bodyY + bodyHeight * 0.3 + armHeight * 0.8);
      ctx.lineTo(bodyX + bodyWidth, bodyY + bodyHeight * 0.7);
      ctx.closePath();
      ctx.fill();
      
      // Torn flesh on arms
      ctx.strokeStyle = '#2a602a';
      ctx.beginPath();
      ctx.moveTo(bodyX - armWidth * 0.6, bodyY + bodyHeight * 0.3 + leftArmOffset + armHeight * 0.6);
      ctx.lineTo(bodyX - armWidth * 0.3, bodyY + bodyHeight * 0.3 + leftArmOffset + armHeight * 0.6);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(bodyX + bodyWidth + armWidth * 0.3, bodyY + bodyHeight * 0.3 + rightArmOffset + armHeight * 0.5);
      ctx.lineTo(bodyX + bodyWidth + armWidth * 0.6, bodyY + bodyHeight * 0.3 + rightArmOffset + armHeight * 0.5);
      ctx.stroke();
    }
    
    // Draw head
    // Create gradient for a more detailed zombie head
    const headGradient = ctx.createLinearGradient(
      headX, headY,
      headX + headSize, headY + headSize
    );
    headGradient.addColorStop(0, '#5cb85c'); // Base zombie green
    headGradient.addColorStop(0.5, '#4a994a'); // Mid green
    headGradient.addColorStop(1, '#3d8b3d'); // Darker green
    
    ctx.fillStyle = headGradient;
    ctx.fillRect(headX, headY, headSize, headSize);
    
    // Head tilt animation - zombies have lolling heads
    const headTilt = Math.sin(frame * 0.2) * 0.05;
    ctx.translate(headX + headSize/2, headY + headSize/2);
    ctx.rotate(headTilt);
    ctx.translate(-(headX + headSize/2), -(headY + headSize/2));
    
    // Zombie face details
    
    // Sunken, bloodshot eyes with uneven sizes
    ctx.fillStyle = 'rgba(200, 0, 0, 0.7)';
    const eyeYPos = headY + headSize * 0.35;
    
    // Left eye - slightly smaller and position based on direction
    let leftEyeX = headX + headSize * 0.3;
    if (direction === 'left') leftEyeX = headX + headSize * 0.25;
    if (direction === 'right') leftEyeX = headX + headSize * 0.35;
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeYPos, headSize * 0.12, 0, Math.PI * 2);
    ctx.fill();
    
    // Right eye - slightly larger
    let rightEyeX = headX + headSize * 0.7;
    if (direction === 'left') rightEyeX = headX + headSize * 0.65;
    if (direction === 'right') rightEyeX = headX + headSize * 0.75;
    ctx.beginPath();
    ctx.arc(rightEyeX, eyeYPos, headSize * 0.14, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye pupils - uneven and mismatched
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeYPos, headSize * 0.06, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeYPos, headSize * 0.07, 0, Math.PI * 2);
    ctx.fill();
    
    // Bloody drool from mouth
    ctx.fillStyle = '#aa0000'; // Dark red
    ctx.beginPath();
    ctx.rect(headX + headSize * 0.35, headY + headSize * 0.7, headSize * 0.3, headSize * 0.15);
    ctx.fill();
    
    // Dripping blood
    ctx.beginPath();
    ctx.moveTo(headX + headSize * 0.45, headY + headSize * 0.85);
    ctx.lineTo(headX + headSize * 0.45, headY + headSize * 0.95);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#aa0000';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(headX + headSize * 0.6, headY + headSize * 0.85);
    ctx.lineTo(headX + headSize * 0.6, headY + headSize * 0.9);
    ctx.stroke();
    
    // Torn flesh on forehead
    ctx.beginPath();
    ctx.moveTo(headX + headSize * 0.3, headY + headSize * 0.2);
    ctx.lineTo(headX + headSize * 0.5, headY + headSize * 0.15);
    ctx.stroke();
    
    // Exposed brain bits
    ctx.fillStyle = '#cc7766'; // Pinkish brain color
    ctx.beginPath();
    ctx.arc(headX + headSize * 0.4, headY + headSize * 0.15, headSize * 0.08, 0, Math.PI * 2);
    ctx.fill();
    
    // Missing ear - right side
    if (direction !== 'left') {
      ctx.fillStyle = '#3d8b3d'; // Darker green to indicate wound
      ctx.beginPath();
      ctx.arc(headX + headSize, headY + headSize * 0.5, headSize * 0.1, Math.PI * 0.75, Math.PI * 1.75, true);
      ctx.fill();
    }
    
    // Additional decomposition effects - small flies circling
    if (Math.random() < 0.7) {
      const flyCount = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < flyCount; i++) {
        const angle = frame * 0.1 + i * Math.PI * 2 / flyCount;
        const radius = headSize * 0.6;
        const flyX = (headX + headSize/2) + Math.cos(angle) * radius;
        const flyY = (headY + headSize/2) + Math.sin(angle) * radius;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(flyX, flyY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Add hit effect particles if being hit
    if (isHit) {
      const particleCount = isCriticalHit ? 8 : 4;
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = width * 0.6 * Math.random();
        const pX = x + width/2 + Math.cos(angle) * distance;
        const pY = y + height/2 + Math.sin(angle) * distance;
        const size = 1 + Math.random() * (isCriticalHit ? 3 : 2);
        
        ctx.fillStyle = isCriticalHit ? '#FF5555' : '#FFAAAA';
        ctx.beginPath();
        ctx.arc(pX, pY, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  };