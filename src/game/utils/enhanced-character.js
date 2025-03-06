// Enhanced player character rendering function
export const drawEnhancedCharacter = (ctx, x, y, width, height, direction, frame, isPlayer = true, color = '#3498db') => {
    ctx.save();
    
    // Character proportions
    const headSize = width * 0.6;
    const bodyWidth = width * 0.8;
    const bodyHeight = height * 0.6;
    
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
    
    if (isPlayer) {
      // PLAYER CHARACTER - More detailed version
      
      // Draw legs with animation
      const legWidth = bodyWidth * 0.25;
      const legHeight = height * 0.3;
      const leftLegOffset = Math.sin(frame * 0.4) * 5;
      const rightLegOffset = Math.sin(frame * 0.4 + Math.PI) * 5;
      
      // Left leg
      ctx.fillStyle = '#1a5276'; // Dark blue pants
      ctx.fillRect(
        bodyX + bodyWidth * 0.25 - legWidth / 2,
        bodyY + bodyHeight - 2,
        legWidth,
        legHeight + leftLegOffset
      );
      
      // Right leg
      ctx.fillRect(
        bodyX + bodyWidth * 0.75 - legWidth / 2,
        bodyY + bodyHeight - 2,
        legWidth,
        legHeight + rightLegOffset
      );
      
      // Boots
      ctx.fillStyle = '#4e342e'; // Brown boots
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
      
      // Body/Torso - with armor/jacket
      ctx.fillStyle = '#2980b9'; // Blue armor/jacket
      ctx.fillRect(bodyX, bodyY, bodyWidth, bodyHeight);
      
      // Add armor details
      ctx.fillStyle = '#3498db'; // Lighter blue details
      ctx.fillRect(bodyX, bodyY, bodyWidth, bodyHeight * 0.2); // Collar/shoulders
      
      // Belt
      ctx.fillStyle = '#4e342e'; // Brown belt
      ctx.fillRect(bodyX - 2, bodyY + bodyHeight - 8, bodyWidth + 4, 6);
      
      // Arms with animation based on direction
      const armWidth = legWidth * 0.8;
      const armHeight = bodyHeight * 0.7;
      
      // Direction-specific arm drawing
      if (direction === 'left' || direction === 'right') {
        ctx.fillStyle = '#2980b9'; // Match jacket color
        
        // Arm in front (showing weapon)
        if (direction === 'right') {
          const armOffset = Math.sin(frame * 0.2) * 3;
          // Drawing arm
          ctx.fillRect(
            bodyX + bodyWidth - 2,
            bodyY + bodyHeight * 0.2 + armOffset,
            armWidth + 5,
            armHeight * 0.6
          );
          
          // Weapon/wand when facing right
          ctx.fillStyle = '#8b4513'; // Brown wand
          ctx.fillRect(
            bodyX + bodyWidth + armWidth,
            bodyY + bodyHeight * 0.2 + armOffset - 5,
            15,
            3
          );
          // Wand tip glow
          const gradient = ctx.createRadialGradient(
            bodyX + bodyWidth + armWidth + 15, 
            bodyY + bodyHeight * 0.2 + armOffset - 3.5,
            0,
            bodyX + bodyWidth + armWidth + 15, 
            bodyY + bodyHeight * 0.2 + armOffset - 3.5,
            8
          );
          gradient.addColorStop(0, 'rgba(0, 255, 255, 1)');
          gradient.addColorStop(0.7, 'rgba(0, 200, 255, 0.6)');
          gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(
            bodyX + bodyWidth + armWidth + 15, 
            bodyY + bodyHeight * 0.2 + armOffset - 3.5, 
            5, 
            0, 
            Math.PI * 2
          );
          ctx.fill();
        } else {
          // Left facing
          const armOffset = Math.sin(frame * 0.2) * 3;
          // Drawing arm
          ctx.fillRect(
            bodyX - armWidth - 3,
            bodyY + bodyHeight * 0.2 + armOffset,
            armWidth + 5,
            armHeight * 0.6
          );
          
          // Weapon/wand when facing left
          ctx.fillStyle = '#8b4513'; // Brown wand
          ctx.fillRect(
            bodyX - armWidth - 15,
            bodyY + bodyHeight * 0.2 + armOffset - 5,
            15,
            3
          );
          // Wand tip glow
          const gradient = ctx.createRadialGradient(
            bodyX - armWidth - 15, 
            bodyY + bodyHeight * 0.2 + armOffset - 3.5,
            0,
            bodyX - armWidth - 15, 
            bodyY + bodyHeight * 0.2 + armOffset - 3.5,
            8
          );
          gradient.addColorStop(0, 'rgba(0, 255, 255, 1)');
          gradient.addColorStop(0.7, 'rgba(0, 200, 255, 0.6)');
          gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(
            bodyX - armWidth - 15, 
            bodyY + bodyHeight * 0.2 + armOffset - 3.5, 
            5, 
            0, 
            Math.PI * 2
          );
          ctx.fill();
        }
      } else {
        // Both arms visible for up/down
        ctx.fillStyle = '#2980b9'; // Match jacket color
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
        
        // Weapon/wand when facing up/down - put in dominant hand
        if (direction === 'up') {
          // Wand when facing up
          ctx.fillStyle = '#8b4513'; // Brown wand
          ctx.fillRect(
            bodyX + bodyWidth + 2,
            bodyY + rightArmOffset,
            3,
            bodyHeight * 0.5
          );
          // Wand tip glow
          const gradient = ctx.createRadialGradient(
            bodyX + bodyWidth + 3.5, 
            bodyY + rightArmOffset - 5,
            0,
            bodyX + bodyWidth + 3.5, 
            bodyY + rightArmOffset - 5,
            8
          );
          gradient.addColorStop(0, 'rgba(0, 255, 255, 1)');
          gradient.addColorStop(0.7, 'rgba(0, 200, 255, 0.6)');
          gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(
            bodyX + bodyWidth + 3.5, 
            bodyY + rightArmOffset - 5, 
            5, 
            0, 
            Math.PI * 2
          );
          ctx.fill();
        } else if (direction === 'down') {
          // Wand when facing down
          ctx.fillStyle = '#8b4513'; // Brown wand
          ctx.fillRect(
            bodyX + bodyWidth + 2,
            bodyY + bodyHeight * 0.2 + rightArmOffset,
            3,
            bodyHeight * 0.5
          );
          // Wand tip glow
          const gradient = ctx.createRadialGradient(
            bodyX + bodyWidth + 3.5, 
            bodyY + bodyHeight * 0.2 + rightArmOffset + bodyHeight * 0.5 + 5,
            0,
            bodyX + bodyWidth + 3.5, 
            bodyY + bodyHeight * 0.2 + rightArmOffset + bodyHeight * 0.5 + 5,
            8
          );
          gradient.addColorStop(0, 'rgba(0, 255, 255, 1)');
          gradient.addColorStop(0.7, 'rgba(0, 200, 255, 0.6)');
          gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(
            bodyX + bodyWidth + 3.5, 
            bodyY + bodyHeight * 0.2 + rightArmOffset + bodyHeight * 0.5 + 5, 
            5, 
            0, 
            Math.PI * 2
          );
          ctx.fill();
        }
      }
      
      // Head position
      const headX = x + (width - headSize) / 2;
      const headY = y + height - bodyHeight - headSize - 2 + (isPlayer ? bounceOffset : 0);
      
      // Draw head
      ctx.fillStyle = '#e8d0b3'; // Skin tone
      ctx.fillRect(headX, headY, headSize, headSize);
      
      // Hair
      ctx.fillStyle = '#4e342e'; // Brown hair
      ctx.fillRect(headX, headY, headSize, headSize * 0.3); // Top hair
      ctx.fillRect(headX, headY, headSize * 0.15, headSize * 0.6); // Left side
      ctx.fillRect(headX + headSize * 0.85, headY, headSize * 0.15, headSize * 0.6); // Right side
      
      // Eyes
      ctx.fillStyle = 'white';
      const eyeSize = headSize * 0.2;
      const eyeY = headY + headSize * 0.4;
      
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
      ctx.fillStyle = '#2c3e50'; // Dark blue pupils
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
      
      // Mouth
      ctx.fillStyle = '#c0392b'; // Red mouth
      const mouthWidth = headSize * 0.4;
      const mouthHeight = headSize * 0.1;
      ctx.fillRect(
        headX + (headSize - mouthWidth) / 2,
        headY + headSize * 0.7,
        mouthWidth,
        mouthHeight
      );
      
      // Add some accessories - wizard hat
      ctx.fillStyle = '#34495e'; // Dark blue hat
      // Hat base
      ctx.beginPath();
      ctx.moveTo(headX - headSize * 0.2, headY + headSize * 0.2);
      ctx.lineTo(headX + headSize * 1.2, headY + headSize * 0.2);
      ctx.lineTo(headX + headSize * 0.5, headY - headSize * 0.5);
      ctx.closePath();
      ctx.fill();
      
      // Hat band
      ctx.fillStyle = '#9b59b6'; // Purple band
      ctx.fillRect(headX - headSize * 0.2, headY + headSize * 0.1, headSize * 1.4, headSize * 0.1);
      
      // Hat star
      ctx.fillStyle = '#f1c40f'; // Yellow star
      ctx.beginPath();
      const starX = headX + headSize * 0.5;
      const starY = headY - headSize * 0.2;
      const starSize = headSize * 0.15;
      for (let i = 0; i < 5; i++) {
        const angle = Math.PI / 2.5 * i - Math.PI / 2;
        const x = starX + Math.cos(angle) * starSize;
        const y = starY + Math.sin(angle) * starSize;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
      
    } else {
      // ENEMY CHARACTER - Using the same design but with enemy-specific colors
      // This just reuses the existing enemy drawing code
      // For a full implementation, you'd customize this section too
      if (color === '#5cb85c') { // Zombie
        // Simple body
        ctx.fillStyle = color;
        ctx.fillRect(bodyX, bodyY, bodyWidth, bodyHeight);
        
        // Head
        const headX = x + (width - headSize) / 2;
        const headY = y + height - bodyHeight - headSize - 2 + bounceOffset;
        ctx.fillRect(headX, headY, headSize, headSize);
        
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
        
        // Ghost head
        const headX = x + (width - headSize) / 2;
        const headY = y + height - bodyHeight - headSize - 2 + bounceOffset;
        ctx.fillRect(headX, headY, headSize, headSize);
        
        // Ghost eyes
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.arc(headX + headSize * 0.3, headY + headSize * 0.35, headSize * 0.1, 0, Math.PI * 2);
        ctx.arc(headX + headSize * 0.7, headY + headSize * 0.35, headSize * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Ghost mouth
        ctx.beginPath();
        ctx.arc(headX + headSize * 0.5, headY + headSize * 0.6, headSize * 0.1, 0, Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      } else {
        // Default enemy rendering (for other enemy types)
        ctx.fillStyle = color;
        ctx.fillRect(bodyX, bodyY, bodyWidth, bodyHeight);
        
        // Enemy head
        const headX = x + (width - headSize) / 2;
        const headY = y + height - bodyHeight - headSize - 2 + bounceOffset;
        ctx.fillRect(headX, headY, headSize, headSize);
        
        // Enemy eyes
        ctx.fillStyle = 'white';
        const eyeSize = headSize * 0.2;
        ctx.fillRect(headX + headSize * 0.2, headY + headSize * 0.3, eyeSize, eyeSize);
        ctx.fillRect(headX + headSize * 0.6, headY + headSize * 0.3, eyeSize, eyeSize);
        
        // Enemy pupils
        ctx.fillStyle = 'black';
        const pupilSize = eyeSize * 0.6;
        ctx.fillRect(headX + headSize * 0.2 + (eyeSize - pupilSize)/2, headY + headSize * 0.3 + (eyeSize - pupilSize)/2, pupilSize, pupilSize);
        ctx.fillRect(headX + headSize * 0.6 + (eyeSize - pupilSize)/2, headY + headSize * 0.3 + (eyeSize - pupilSize)/2, pupilSize, pupilSize);
      }
    }
    
    ctx.restore();
  };