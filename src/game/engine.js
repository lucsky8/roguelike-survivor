// Main game engine
import { stageConfigs, enemyTypes } from './config';
import { createTileMap, drawCharacter, drawProjectile, drawGem, drawFireAura, drawDamageText, drawParticleEffect, drawUI } from './utils/rendering';
import { updatePlayerPosition, applyWeaponUpgrade } from './entities/player';
import { updateWeapons, updateEnemyEffects } from './entities/weapons';
import { spawnEnemies, spawnBoss, updateEnemies as originalUpdateEnemies, processEnemyHit } from './entities/enemies';
import { drawEnhancedCharacter } from './utils/enhanced-character';
import { drawEnhancedGhost } from './utils/enhanced-ghost';
import { drawEnhancedZombie } from './utils/enhanced-zombie';
//import { createEnhancedTileMap, drawRefinedBackgroundEffects } from './utils/enhanced-background';
import { 
  createEnhancedTileMap, 
  createVampireSurvivorsBackground,
  createInfiniteBackground 
} from './utils/enhanced-background';
import { 
  drawEnhancedProjectile, 
  drawEnhancedHitEffect, 
  drawEnhancedDamageText, 
  drawEnhancedFireAura,
  updateProjectileTrails,
  createEnemyHitEffect,
  drawEnemyWithHitEffects,
  drawFrostEffect,
  drawLightningEffect,
  drawLightningImpact
} from './utils/enhanced-projectiles';


// Initialize game engine with improved background
export const initGameEngine = (canvas, gameData) => {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

  // Use createInfiniteBackground instead of createVampireSurvivorsBackground
  const tileSize = 128; // Size of a single tile
  ctx.backgroundPattern = createInfiniteBackground(ctx); // Create the pattern
  
  // Create larger background to prevent visual issues when scrolling
  // Increased size from 4x to 6x for better coverage during scrolling
  // Create larger background to prevent visual issues when scrolling
  ctx.tileMap = createVampireSurvivorsBackground(ctx, canvas.width * 6, canvas.height * 6);
  
  // Add an additional field to track when the background was created
  ctx.backgroundCreationTime = Date.now();
  
  return ctx;
};

// Calculate scaling factor based on canvas size
const calculateScaleFactor = (canvas) => {
  // Base resolution that the game was designed for
  const baseWidth = 800;
  const baseHeight = 600;
  
  // Calculate width and height scaling
  const widthScale = canvas.width / baseWidth;
  const heightScale = canvas.height / baseHeight;
  
  // Use the minimum of the two to ensure consistent gameplay
  return Math.min(widthScale, heightScale);
};

// Enhanced updateEnemies function with support for enemy effects
export const updateEnemies = (
  enemies, player, playerStats, deltaTime, animation, setGameState, onPlayerDamage, canvas
) => {
  // Calculate scaling factor for collision detection
  const scaleFactor = canvas ? calculateScaleFactor(canvas) : 1;
  
  // Base collision distance for player collision (scale with screen size)
  const baseCollisionDistance = 20 * scaleFactor;
  
  enemies.forEach(enemy => {
    if (enemy.isDead) return;

    // Update enemy effects (frost, etc.)
    if (updateEnemyEffects) {
      updateEnemyEffects(enemy);
    }

    const dx = player.x + player.width / 2 - (enemy.x + enemy.width / 2);
    const dy = player.y + player.height / 2 - (enemy.y + enemy.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Exploder Logic - Now scales with screen size
    if (enemy.explodesOnDeath && distance < 40 * scaleFactor) {
      onPlayerDamage(enemy.damage);
      enemy.isDead = true;
      return;
    }

    // Regular Enemy Collision Logic - Apply damage when touching player
    if (distance < baseCollisionDistance) {
      if (!enemy.lastAttack || Date.now() - enemy.lastAttack > (enemy.attackCooldown || 1000)) {
        enemy.lastAttack = Date.now();
        animation.damageTexts.push({
          x: player.x,
          y: player.y - 20,
          value: enemy.damage,
          duration: 30,
          currentFrame: 0,
          isCritical: false,
          isPlayer: true
        });
        onPlayerDamage(enemy.damage);
      }
    }

    // Ranged Enemy Behavior (Stop & Shoot) - Scale attack range
    const scaledAttackRange = (enemy.attackRange || 150) * scaleFactor;
    if (enemy.type === 'ranged' && distance < scaledAttackRange) {
      if (!enemy.lastAttack || Date.now() - enemy.lastAttack > enemy.attackCooldown) {
        enemy.lastAttack = Date.now();
        animation.damageTexts.push({
          x: player.x,
          y: player.y - 20,
          value: enemy.damage,
          duration: 30,
          currentFrame: 0,
          isCritical: false,
          isPlayer: true
        });
        onPlayerDamage(enemy.damage);
      }
      return; // Ranged enemies don't move closer
    }

    // Normal movement (for all other enemies)
    if (distance > 0) {
      const vx = (dx / distance) * enemy.speed;
      const vy = (dy / distance) * enemy.speed;
      enemy.x += vx;
      enemy.y += vy;
      
      // Update enemy direction based on movement
      if (Math.abs(vx) > Math.abs(vy)) {
        enemy.direction = vx > 0 ? 'right' : 'left';
      } else {
        enemy.direction = vy > 0 ? 'down' : 'up';
      }
      
      // Update enemy animation frame
      enemy.frameCount++;
      if (enemy.frameCount >= enemy.frameDelay) {
        enemy.frameCount = 0;
        enemy.animationFrame = (enemy.animationFrame + 1) % (enemy.animationFrames || 4);
      }
      
      // Add visual effects for enemies with active effects
      if (enemy.effects) {
        // Frost effect
        if (enemy.effects.frost) {
          // Add occasional frost particles around slowed enemies
          if (Math.random() < 0.05) {
            const angle = Math.random() * Math.PI * 2;
            const particleDistance = enemy.width * 0.6 * Math.random();
            
            animation.effectFrames.push({
              x: enemy.x + enemy.width / 2 + Math.cos(angle) * particleDistance,
              y: enemy.y + enemy.height / 2 + Math.sin(angle) * particleDistance,
              type: 'particle',
              color: 'rgba(100, 210, 255, 0.7)',
              size: 2 + Math.random() * 2,
              duration: 15 + Math.random() * 10,
              currentFrame: 0,
            });
          }
        }
      }
    }
  });

  // Remove dead enemies
  return enemies.filter(enemy => !enemy.isDead);
};

// Main update function with Second Chance implementation and health regeneration
export const updateGame = (deltaTime, currentTime, gameData, gameState) => {
  const { 
    player, 
    enemies, 
    experienceGems, 
    animation, 
    keysPressed 
  } = gameData;
  
  const { 
    playerStats, 
    stage, 
    setStage, 
    stageMessage, 
    setStageMessage, 
    showStageMessage, 
    setShowStageMessage, 
    stageMessageTimerRef,
    setPlayerStats,
    time, 
    setTime,
    setScore,
    setExperience,
    setGameState,
    upgrades,
    level
  } = gameState;
  
  // Get canvas reference
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  
  // Update time
  setTime(prev => prev + deltaTime);

  // Apply health regeneration if the player has it
  if (playerStats.regeneration) {
    // Regenerate 1% of max health per second per regeneration point
    const regenAmount = (playerStats.regeneration * playerStats.maxHealth * 0.01) * (deltaTime / 1000);

    // Smoothly interpolate camera zoom if it exists
    if (gameData.camera && gameData.camera.zoom !== gameData.camera.targetZoom) {
      gameData.camera.zoom += (gameData.camera.targetZoom - gameData.camera.zoom) * 0.1;
      
      // Snap to target when very close to avoid floating point issues
      if (Math.abs(gameData.camera.zoom - gameData.camera.targetZoom) < 0.01) {
        gameData.camera.zoom = gameData.camera.targetZoom;
      }
    }
    
    if (playerStats.health < playerStats.maxHealth) {
      setPlayerStats(prev => ({
        ...prev,
        health: Math.min(prev.health + regenAmount, prev.maxHealth)
      }));
    }
  }

  // Check for game over condition with Second Chance implementation
  if (playerStats.health <= 0) {
    // Check if player has a revive available
    if (playerStats.reviveCount && playerStats.reviveCount > 0) {
      // Trigger revive effect
      const reviveHealth = Math.ceil(playerStats.maxHealth * 0.2); // 20% of max health
      
      // Update player stats
      setPlayerStats(prev => ({
        ...prev,
        health: reviveHealth,
        reviveCount: prev.reviveCount - 1
      }));
      
      // Add visual effect for revive
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80;
        
        animation.effectFrames.push({
          x: player.x + player.width / 2 + Math.cos(angle) * distance,
          y: player.y + player.height / 2 + Math.sin(angle) * distance,
          type: 'particle',
          color: 'rgba(255, 215, 0, 0.8)', // Gold color
          size: 5 + Math.random() * 8,
          duration: 40 + Math.random() * 30,
          currentFrame: 0,
        });
      }
      
      // Show revival message
      setStageMessage("Second Chance Activated!");
      setShowStageMessage(true);
      
      // Clear message after 2 seconds
      if (stageMessageTimerRef.current) {
        clearTimeout(stageMessageTimerRef.current);
      }
      stageMessageTimerRef.current = setTimeout(() => {
        setShowStageMessage(false);
        stageMessageTimerRef.current = null;
      }, 2000);
      
      // Return early to continue the game
      return;
    }
    
    // If no revive available, game over
    setGameState('gameOver');
    return; // Stop further game updates
  }
  
  // Get current stage config
  const currentStageConfig = stageConfigs[stage - 1];
  
  // Update player position
  const movement = updatePlayerPosition(player, playerStats, keysPressed, canvas,gameData.camera);
  
  // Update background offset for parallax - ENHANCED PARALLAX EFFECT
  if (movement.dx !== 0 || movement.dy !== 0) {
    // Apply movement with proper wrapping
    animation.bgOffset.x -= movement.dx * 0.5;
    animation.bgOffset.y -= movement.dy * 0.5;
    
    // Ensure proper wrapping for both positive and negative values
    const ctx = canvas.getContext('2d');
    if (ctx && ctx.tileMap) {
      // This modulo formula works for both positive and negative values
      animation.bgOffset.x = ((animation.bgOffset.x % ctx.tileMap.width) + ctx.tileMap.width) % ctx.tileMap.width;
      animation.bgOffset.y = ((animation.bgOffset.y % ctx.tileMap.height) + ctx.tileMap.height) % ctx.tileMap.height;
      
      // Log for debugging
      //console.log(`Offset: ${animation.bgOffset.x.toFixed(2)}, ${animation.bgOffset.y.toFixed(2)}`);
    }
  }
  
  // Apply any weapon upgrades from the upgrades list
  if (upgrades && upgrades.length > 0) {
    upgrades.forEach(upgradeId => {
      applyWeaponUpgrade(player, upgradeId);
    });
  }
  
  // Increment animation frames
  animation.playerWalk += deltaTime / 50;
  
  // Update player animation frame
  player.frameCount++;
  if (player.frameCount >= player.frameDelay) {
    player.frameCount = 0;
    player.currentFrame = (player.currentFrame + 1) % 4;
  }
  
  // Check for stage transitions
  const nextStageConfig = stageConfigs[stage];
  
  if (nextStageConfig && time >= currentStageConfig.duration * stage) {
    // Move to next stage
    setStage(prev => prev + 1);
    setStageMessage(nextStageConfig.message);
    setShowStageMessage(true);
    
    // Update background with new stage
 
    const ctx = canvas.getContext('2d');
    ctx.tileMap = createVampireSurvivorsBackground(ctx, canvas.width * 6, canvas.height * 6);
 
    
    // Clear stage message after 3 seconds
    if (stageMessageTimerRef.current) {
      clearTimeout(stageMessageTimerRef.current);
    }
    stageMessageTimerRef.current = setTimeout(() => {
      setShowStageMessage(false);
      stageMessageTimerRef.current = null;
    }, 3000);
    
    // Spawn boss if this stage has one
    if (currentStageConfig.bossType) {
      const boss = spawnBoss(
        canvas, 
        currentStageConfig, 
        enemies,
        setStageMessage,
        setShowStageMessage,
        stageMessageTimerRef
      );
      
      if (boss) {
        enemies.push(boss);
        
        // Add boss entrance effect
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 80;
          
          animation.effectFrames.push({
            x: boss.x + boss.width / 2 + Math.cos(angle) * distance,
            y: boss.y + boss.height / 2 + Math.sin(angle) * distance,
            type: 'particle',
            color: 'rgba(255, 0, 0, 0.7)',
            size: 5 + Math.random() * 8,
            duration: 30 + Math.random() * 30,
            currentFrame: 0,
          });
        }
      }
    }
    
    // Add stage transition effect
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      
      animation.effectFrames.push({
        x: x,
        y: y,
        type: 'particle',
        color: 'rgba(255, 255, 255, 0.7)',
        size: 3 + Math.random() * 5,
        duration: 30 + Math.random() * 30,
        currentFrame: 0,
      });
    }
  }
  
  // Boss spawning for endless stage
  if (stage === 6 && time % stageConfigs[5].bossSpawnInterval < deltaTime) {
    
    const boss = spawnBoss(
      canvas, 
      currentStageConfig, 
      enemies,
      setStageMessage,
      setShowStageMessage,
      stageMessageTimerRef
    );
    
    if (boss) {
      enemies.push(boss);
    }
  }
  
  // Update weapons and projectiles
  updateWeapons(player, playerStats, currentTime, enemies, animation, (enemy, damage, isCritical) => {
    processEnemyHit(enemy, damage, isCritical, experienceGems, setScore, animation);
  });
  
  // Spawn new enemies
  // In engine.js
spawnEnemies(player, canvas, currentStageConfig, time, enemies, gameData.camera);
  
  // Update enemies with enhanced function that supports effects
  gameData.enemies = updateEnemies(enemies, player, playerStats, deltaTime, animation, setGameState, (damageAmount) => {
    setPlayerStats(prev => ({
      ...prev,
      health: prev.health - damageAmount,
    }));
  }, canvas);
  
  // Update experience gems
  experienceGems.forEach(gem => {
    // Move gems towards player if close enough
    const dx = player.x + player.width / 2 - gem.x;
    const dy = player.y + player.height / 2 - gem.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Modify gem pickup radius based on magnetRadius stat if it exists
    const pickupRadius = playerStats.magnetRadius ? 120 * playerStats.magnetRadius : 120;
    
    if (distance < pickupRadius) {
      // Move towards player
      const speed = 5 * (1 - distance / pickupRadius) + 2;
      gem.x += dx / distance * speed;
      gem.y += dy / distance * speed;
    }
    
    // Check if player collected gem
    if (distance < 20) {
      gem.collected = true;
      // Add experience
      setExperience(prev => prev + gem.value);
      
      // Add collection effect
      for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 15;
        
        animation.effectFrames.push({
          x: gem.x + Math.cos(angle) * distance,
          y: gem.y + Math.sin(angle) * distance,
          type: 'particle',
          color: '#00FFFF',
          size: 2 + Math.random() * 3,
          duration: 15 + Math.random() * 10,
          currentFrame: 0,
        });
      }
    }
  });
  
  // Remove collected gems
  gameData.experienceGems = experienceGems.filter(gem => !gem.collected);
  
  // Update particle effects
  animation.effectFrames.forEach(effect => {
    effect.currentFrame++;
  });
  
  // Remove expired effects
  animation.effectFrames = animation.effectFrames.filter(effect => {
    return effect.currentFrame < effect.duration;
  });
  
  // Update damage texts
  animation.damageTexts.forEach(text => {
    text.currentFrame++;
  });
  
  // Remove expired damage texts
  animation.damageTexts = animation.damageTexts.filter(text => {
    return text.currentFrame < text.duration;
  });
};

// Main render function with support for enemy effects
// This is the part of your engine.js file that needs to be modified
// to support camera zoom

export const renderGame = (canvas, gameData, gameState) => {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

  
  if (!ctx) return;
  
  const { 
    player, 
    enemies, 
    experienceGems, 
    animation,
    camera // Make sure this is included in your destructuring
  } = gameData;
  
  const currentTime = performance.now();
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Save the context state before transformations
  ctx.save();

  // Fill with base color first (in case of any gaps)
  ctx.fillStyle = '#2a7d2a'; // Dark green base
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Apply camera transformations
  // Center the canvas
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // Camera position should be the player's position (this is the key change)
  const cameraX = player.x + player.width / 2;
  const cameraY = player.y + player.height / 2;
  
  // Apply zooming and centering transformation
  ctx.translate(centerX, centerY);
  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-cameraX, -cameraY);
  
  // Draw tiled background
  if (!ctx.tileMap || !ctx.tileMap.width || !ctx.tileMap.height) {
    ctx.tileMap = createVampireSurvivorsBackground(ctx, canvas.width * 6, canvas.height * 6);
  }

  if (!ctx.backgroundPattern) {
    ctx.backgroundPattern = createInfiniteBackground(ctx);
  }
  
  // Draw tileMap with offset - improved coverage to prevent black spaces
  const tileMapWidth = ctx.tileMap.width;
  const tileMapHeight = ctx.tileMap.height;

  // Calculate starting position to ensure background covers the view
  const viewportWidth = canvas.width / camera.zoom;
  const viewportHeight = canvas.height / camera.zoom;
  
  // Calculate the visible area in world coordinates
  const viewportLeft = cameraX - viewportWidth / 2;
  const viewportTop = cameraY - viewportHeight / 2;
  
  // Calculate how many tiles we need to cover the viewport
  const tilesX = Math.ceil(viewportWidth / tileMapWidth) + 2;
  const tilesY = Math.ceil(viewportHeight / tileMapHeight) + 2;
  
  // Calculate starting tile positions
  const startTileX = Math.floor(viewportLeft / tileMapWidth) - 1;
  const startTileY = Math.floor(viewportTop / tileMapHeight) - 1;
  
  // Draw enough tiles to cover the viewport
  for (let x = 0; x < tilesX; x++) {
    for (let y = 0; y < tilesY; y++) {
      const tileX = (startTileX + x) * tileMapWidth;
      const tileY = (startTileY + y) * tileMapHeight;
      
      ctx.drawImage(
        ctx.tileMap,
        0, 0, tileMapWidth, tileMapHeight,
        tileX, tileY, tileMapWidth, tileMapHeight
      );
    }
  }

  // Draw experience gems
  experienceGems.forEach(gem => {
    drawGem(ctx, gem, currentTime);
  });
  
  // Draw player weapons
  player.weapons.forEach(weapon => {
    if (weapon.type === 'fire') {
      // Draw fire aura
      const radius = weapon.radius * gameState.playerStats.area * (weapon.level === 2 ? 1.2 : weapon.level === 3 ? 1.5 : 1);
      drawEnhancedFireAura(
        ctx,
        player.x + player.width / 2,
        player.y + player.height / 2,
        radius,
        currentTime
      );
    } else if (weapon.type === 'frost' && !weapon.projectiles) {
      // Draw frost nova
      const radius = weapon.radius * gameState.playerStats.area * (weapon.level === 2 ? 1.3 : 1);
      drawFrostEffect(
        ctx,
        player.x + player.width / 2,
        player.y + player.height / 2,
        radius,
        currentTime
      );
    }
    
    // Draw projectiles
    if (weapon.projectiles) {
      weapon.projectiles.forEach(projectile => {
        drawEnhancedProjectile(ctx, projectile, weapon.type, currentTime);
      });
    }
  });
  
  // Draw enemies
  enemies.forEach(enemy => {
    if (enemy.isDead) return;
    
    // Use enhanced renderers for specific enemy types
    if (enemy.type === 'ghost') {
      drawEnhancedGhost(
        ctx,
        enemy.x,
        enemy.y,
        enemy.width,
        enemy.height,
        enemy.direction || 'down',
        enemy.animationFrame,
        enemy
      );
    } else if (enemy.type === 'zombie') {
      drawEnhancedZombie(
        ctx,
        enemy.x,
        enemy.y,
        enemy.width,
        enemy.height,
        enemy.direction || 'down',
        enemy.animationFrame,
        enemy
      );
    } else {
      // For other enemy types, use the standard character renderer with hit effects
      if (enemy.hitEffect && (Date.now() - enemy.hitEffect.startTime) < enemy.hitEffect.duration) {
        drawEnemyWithHitEffects(
          ctx,
          enemy,
          enemy.direction || 'down',
          enemy.animationFrame,
          enemy.color,
          enemy.hitEffect
        );
        
        // Also draw the regular character underneath
        drawCharacter(
          ctx,
          enemy.x,
          enemy.y,
          enemy.width,
          enemy.height,
          enemy.direction || 'down',
          enemy.animationFrame,
          false,
          enemy.color
        );
      } else {
        // Normal rendering without hit effect
        drawCharacter(
          ctx,
          enemy.x,
          enemy.y,
          enemy.width,
          enemy.height,
          enemy.direction || 'down',
          enemy.animationFrame,
          false,
          enemy.color
        );
      }
    }
    
    // Draw effect overlays for enemies
    if (enemy.effects) {
      // Frost effect 
      if (enemy.effects.frost) {
        // Draw frost overlay
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = 'rgba(150, 240, 255, 0.3)';
        
        // Draw frost aura
        ctx.beginPath();
        ctx.arc(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2,
          enemy.width * 0.7,
          0,
          Math.PI * 2
        );
        ctx.fill();
        
        // Draw frost crystals
        const crystalCount = 3;
        
        for (let i = 0; i < crystalCount; i++) {
          const angle = (i / crystalCount) * Math.PI * 2 + (currentTime * 0.001);
          const distance = enemy.width * 0.5;
          const x = enemy.x + enemy.width / 2 + Math.cos(angle) * distance;
          const y = enemy.y + enemy.height / 2 + Math.sin(angle) * distance;
          
          ctx.fillStyle = 'rgba(200, 250, 255, 0.7)';
          ctx.beginPath();
          
          // Draw crystal shape
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          
          const size = 3 + Math.sin(currentTime * 0.003 + i) * 1;
          
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size/2, 0);
          ctx.lineTo(0, size);
          ctx.lineTo(-size/2, 0);
          ctx.closePath();
          ctx.fill();
          
          ctx.restore();
        }
        
        ctx.globalAlpha = 1; // Reset alpha
      }
    }
    
    // Draw health bar
    const maxHealth = enemy.isBoss ? enemy.health : enemyTypes.find(e => e.type === enemy.type).health;
    const healthPercent = enemy.health / maxHealth;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(enemy.x - 5, enemy.y - 15, enemy.width + 10, 8);
    
    ctx.fillStyle = healthPercent > 0.5 ? '#2ecc71' : healthPercent > 0.2 ? '#f39c12' : '#e74c3c';
    ctx.fillRect(enemy.x - 5, enemy.y - 15, (enemy.width + 10) * healthPercent, 8);
    
    // Draw boss name if it's a boss
    if (enemy.isBoss) {
      ctx.fillStyle = '#FF0000';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(enemy.name, enemy.x + enemy.width / 2, enemy.y - 20);
      ctx.textAlign = 'left'; // Reset text align
      ctx.textBaseline = 'alphabetic'; // Reset text baseline
    }
  });
  
  // Draw player
  drawEnhancedCharacter(
    ctx,
    player.x,
    player.y,
    player.width,
    player.height,
    player.direction,
    player.isMoving ? animation.playerWalk : 0
  );
  
  // Draw particle effects
  animation.effectFrames.forEach(effect => {
    drawEnhancedHitEffect(ctx, effect);
  });
  
  // Draw damage texts
  animation.damageTexts.forEach(text => {
    drawEnhancedDamageText(ctx, text);
  });
  
  // Restore context to remove zoom before drawing UI
  ctx.restore();
  
  // Draw UI elements with proper level value (UI should NOT be zoomed)
  drawUI(ctx, canvas, gameData, {
    ...gameState,
    level: gameState.level || 1  // Ensure level is passed with a fallback
  });
};