// Enhanced ghost enemy renderer
export const drawEnhancedGhost = (ctx, x, y, width, height, direction, frame) => {
    ctx.save();
    
    // Ghost properties
    const headSize = width * 0.8;
    const bodyWidth = width * 1.1;
    const bodyHeight = height * 0.7;
    
    // Position calculations
    const floatOffset = Math.sin(frame * 0.2) * 4; // Floating animation
    const bodyX = x + (width - bodyWidth) / 2;
    const bodyY = y + height - bodyHeight - 5 + floatOffset;
    const headX = x + (width - headSize) / 2;
    const headY = y + height - bodyHeight - headSize - 2 + floatOffset;
    
    // Semi-transparent effect
    ctx.globalAlpha = 0.85;
    
    // Draw ghost body (wispy shape with tentacle-like bottom)
    ctx.fillStyle = '#d9d9d9';
    
    // Main body shape
    ctx.beginPath();
    ctx.moveTo(bodyX, bodyY);
    ctx.lineTo(bodyX + bodyWidth, bodyY);
    ctx.lineTo(bodyX + bodyWidth, bodyY + bodyHeight * 0.6);
    
    // Right side wispy curves
    ctx.quadraticCurveTo(
      bodyX + bodyWidth * 0.9,
      bodyY + bodyHeight * 0.7,
      bodyX + bodyWidth * 0.85,
      bodyY + bodyHeight
    );
    ctx.quadraticCurveTo(
      bodyX + bodyWidth * 0.8,
      bodyY + bodyHeight * 0.8,
      bodyX + bodyWidth * 0.7,
      bodyY + bodyHeight * 0.9
    );
    
    // Middle wispy section
    ctx.quadraticCurveTo(
      bodyX + bodyWidth * 0.6,
      bodyY + bodyHeight * 1.1,
      bodyX + bodyWidth * 0.5,
      bodyY + bodyHeight * 0.85
    );
    ctx.quadraticCurveTo(
      bodyX + bodyWidth * 0.4,
      bodyY + bodyHeight * 1.1,
      bodyX + bodyWidth * 0.3,
      bodyY + bodyHeight * 0.9
    );
    
    // Left side wispy curves
    ctx.quadraticCurveTo(
      bodyX + bodyWidth * 0.2,
      bodyY + bodyHeight * 0.8,
      bodyX + bodyWidth * 0.15,
      bodyY + bodyHeight
    );
    ctx.quadraticCurveTo(
      bodyX + bodyWidth * 0.1,
      bodyY + bodyHeight * 0.7,
      bodyX,
      bodyY + bodyHeight * 0.6
    );
    
    // Complete the path and fill
    ctx.closePath();
    ctx.fill();
    
    // Draw a subtle gradient overlay for ghostly effect
    const ghostGradient = ctx.createLinearGradient(
      bodyX, bodyY, 
      bodyX, bodyY + bodyHeight
    );
    ghostGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    ghostGradient.addColorStop(0.5, 'rgba(230, 230, 255, 0.2)');
    ghostGradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
    
    ctx.fillStyle = ghostGradient;
    ctx.fill(); // Reuse the current path
    
    // Draw ghost head (slightly translucent)
    ctx.fillStyle = '#e6e6e6';
    ctx.beginPath();
    ctx.arc(
      headX + headSize / 2,
      headY + headSize / 2,
      headSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Face features
    // Eyes - large hollow circles for a spooky look
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.lineWidth = 2;
    
    // Direction affects eye placement
    let leftEyeX, rightEyeX;
    const eyeY = headY + headSize * 0.4;
    
    // Position eyes based on direction
    if (direction === 'left') {
      leftEyeX = headX + headSize * 0.25;
      rightEyeX = headX + headSize * 0.5;
    } else if (direction === 'right') {
      leftEyeX = headX + headSize * 0.5;
      rightEyeX = headX + headSize * 0.75;
    } else {
      leftEyeX = headX + headSize * 0.3;
      rightEyeX = headX + headSize * 0.7;
    }
    
    // Draw eye outlines
    const eyeSize = headSize * 0.22;
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(rightEyeX, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.stroke();
    
    // Small pupils that move slightly based on direction
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    const pupilSize = eyeSize * 0.5;
    
    // Adjust pupil position based on direction
    let pupilOffsetX = 0;
    let pupilOffsetY = 0;
    if (direction === 'left') pupilOffsetX = -2;
    if (direction === 'right') pupilOffsetX = 2;
    if (direction === 'up') pupilOffsetY = -2;
    if (direction === 'down') pupilOffsetY = 2;
    
    // Draw pupils
    ctx.beginPath();
    ctx.arc(
      leftEyeX + pupilOffsetX, 
      eyeY + pupilOffsetY, 
      pupilSize, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(
      rightEyeX + pupilOffsetX, 
      eyeY + pupilOffsetY, 
      pupilSize, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Moaning mouth - oval shape
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.ellipse(
      headX + headSize / 2,
      headY + headSize * 0.7,
      headSize * 0.15,
      headSize * 0.1,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Add subtle ghostly glow around the entire ghost
    ctx.globalAlpha = 0.15 + Math.sin(frame * 0.1) * 0.05; // Pulsing glow
    const glowSize = Math.max(width, height) * 0.6;
    const glowGradient = ctx.createRadialGradient(
      x + width / 2, 
      y + height / 2, 
      0,
      x + width / 2, 
      y + height / 2, 
      glowSize
    );
    glowGradient.addColorStop(0, 'rgba(180, 180, 255, 0.5)');
    glowGradient.addColorStop(0.5, 'rgba(180, 180, 255, 0.2)');
    glowGradient.addColorStop(1, 'rgba(180, 180, 255, 0)');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(
      x + width / 2,
      y + height / 2,
      glowSize,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw wispy trails/particles behind the ghost
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#d9d9d9';
    
    // Add 3 small trailing particles with different positions based on frame
    for (let i = 0; i < 3; i++) {
      const particleOffset = (frame * 0.1 + i * 0.5) % 3;
      const particleX = bodyX + bodyWidth * (0.2 + i * 0.3) - particleOffset * 3;
      const particleY = bodyY + bodyHeight * (0.5 + particleOffset * 0.15);
      const particleSize = 3 - particleOffset;
      
      if (particleSize > 0) {
        ctx.beginPath();
        ctx.arc(
          particleX,
          particleY,
          particleSize,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
    
    // Reset global alpha
    ctx.globalAlpha = 1;
    ctx.restore();
  };