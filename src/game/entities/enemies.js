// Enemy management system
import { enemyTypes } from '../config';
import { createEnemyHitEffect } from '../utils/enhanced-projectiles';

// Spawn new enemies with improved offscreen spawning and reduced spawn rate
// Update the enemy spawning function in your engine.js file

export const spawnEnemies = (player, canvas, stageConfig, time, enemies, camera) => {
  if (!stageConfig) return;

  // Apply spawn chance with reduced rate
  const spawnChance = Math.min(stageConfig.spawnRate * (1 + time / 180000) / 5, 0.4);
  if (Math.random() >= spawnChance) return;

  // Create enemy pool
  const enemyPool = stageConfig.enemyTypes
    .map(type => {
      const enemy = enemyTypes.find(e => e.type === type);
      return enemy;
    })
    .filter(Boolean);
  
  if (enemyPool.length === 0) return;

  // Randomly choose an enemy type
  const randomIndex = Math.floor(Math.random() * enemyPool.length);
  const enemyType = enemyPool[randomIndex];

  // Calculate visible area based on camera zoom
  const visibleWidth = canvas.width / camera.zoom;
  const visibleHeight = canvas.height / camera.zoom;
  
  // Spawn enemies off-screen in a circle around the player
  // This creates the effect of enemies coming from all directions
  const spawnDistance = Math.max(visibleWidth, visibleHeight) * 0.6; // Just outside visible area
  const spawnAngle = Math.random() * Math.PI * 2; // Random angle around player
  
  // Calculate spawn position based on angle and distance from player
  const x = player.x + Math.cos(spawnAngle) * spawnDistance;
  const y = player.y + Math.sin(spawnAngle) * spawnDistance;

  // Create enemy object with varied attributes
  const enemy = {
    ...enemyType,
    x,
    y,
    isDead: false,
    animationFrame: 0,
    frameCount: 0,
    frameDelay: enemyType.animationSpeed || 10,
    color: enemyType.color,
    speed: enemyType.speed * (0.8 + Math.random() * 0.4), // Small random variation
    health: enemyType.health * (0.9 + Math.random() * 0.2), // Small variation in HP
  };

  enemies.push(enemy);
};

// Spawn a boss with reduced frequency for endless mode
export const spawnBoss = (canvas, stageConfig, enemies, setStageMessage, setShowStageMessage, stageMessageTimerRef) => {
  if (!stageConfig || !stageConfig.bossType || !canvas) return;

  // Find the boss enemy type
  const bossEnemyType = enemyTypes.find(e => e.type === stageConfig.bossType);

  // Create a boss enemy
  const boss = {
    ...bossEnemyType,
    health: stageConfig.bossHealth || bossEnemyType.health * 3,
    name: stageConfig.bossName || "BOSS",
    x: canvas.width / 2 - (bossEnemyType.width || 80) / 2,
    y: -150,
    width: bossEnemyType.width || 80,
    height: bossEnemyType.height || 80,
    isDead: false,
    isBoss: true,
    speed: bossEnemyType.speed || 1.5,
    animationFrame: 0,
    frameCount: 0,
    frameDelay: bossEnemyType.animationSpeed || 10,
  };

  // Add boss to enemies array
  enemies.push(boss);
  
  // Display boss message using a try-catch to handle any potential errors
  try {
    if (typeof setStageMessage === 'function') {
      setStageMessage(`⚠️ A powerful boss has appeared! ⚠️`);
      if (typeof setShowStageMessage === 'function') {
        setShowStageMessage(true);
      }

      // Set timer to hide message
      if (stageMessageTimerRef && stageMessageTimerRef.current) {
        clearTimeout(stageMessageTimerRef.current);
      }
      
      if (stageMessageTimerRef) {
        stageMessageTimerRef.current = setTimeout(() => {
          if (typeof setShowStageMessage === 'function') {
            setShowStageMessage(false);
          }
        }, 3000);
      }
    } else {
      console.error("❌ setStageMessage is not a function:", setStageMessage);
    }
  } catch (error) {
    console.error("❌ Error displaying boss message:", error);
  }
  
  return boss;
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

// Update enemy positions
export const updateEnemies = (
  enemies, player, playerStats, deltaTime, animation, setGameState, onPlayerDamage, canvas
) => {
  // Calculate scaling factor for collision detection
  const scaleFactor = canvas ? calculateScaleFactor(canvas) : 1;
  
  // Base collision distance for player collision (scale with screen size)
  const baseCollisionDistance = 20 * scaleFactor;
  
  enemies.forEach(enemy => {
    if (enemy.isDead) return;

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
          isCritical: false
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
          isCritical: false
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
    }
  });

  // Remove dead enemies
  return enemies.filter(enemy => !enemy.isDead);
};

// Process enemy hit
export const processEnemyHit = (enemy, damage, isCritical, experienceGems, setScore, animation) => {
  // Apply damage
  enemy.health -= damage;

  // Add damage text
  animation.damageTexts.push({
    x: enemy.x + enemy.width / 2,
    y: enemy.y,
    value: Math.floor(damage),
    duration: 40,
    currentFrame: 0,
    isCritical: isCritical,
    isPlayer: false, // Explicitly mark as not player damage
    color: isCritical ? '#FF0000' : '#FFFF00' // Yellow for normal, red for critical
  });

   // Create hit effect animation on enemy
   //enemy.hitEffect = createEnemyHitEffect(enemy, isCritical);
   // Create hit effect animation on enemy - only for non-enhanced enemies
  // Enhanced enemies like ghost and zombie have their own visual feedback
  if (enemy.type !== 'ghost' && enemy.type !== 'zombie') {
    enemy.hitEffect = createEnemyHitEffect(enemy, isCritical);
  } else {
    // Flash the enhanced enemies briefly when hit
    enemy.isHit = true;
    enemy.hitTime = Date.now();
    enemy.hitDuration = isCritical ? 300 : 150;
  }

  // Check if enemy is dead
  if (enemy.health <= 0 && !enemy.isDead) {
    enemy.isDead = true;

    // Add death effects
    for (let i = 0; i < (enemy.isBoss ? 30 : 10); i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * enemy.width / 2;

      animation.effectFrames.push({
        x: enemy.x + enemy.width / 2 + Math.cos(angle) * distance,
        y: enemy.y + enemy.height / 2 + Math.sin(angle) * distance,
        type: 'particle',
        color: 'rgba(255, 0, 0, 0.7)',
        size: 3 + Math.random() * 5,
        duration: 20 + Math.random() * 20,
        currentFrame: 0,
      });
    }

    // Add experience gem
    experienceGems.push({
      x: enemy.x + enemy.width / 2,
      y: enemy.y + enemy.height / 2,
      value: enemy.experienceValue,
      width: enemy.isBoss ? 20 : 15,
      height: enemy.isBoss ? 20 : 15,
      color: '#00FFFF',
    });

    // Update score
    setScore(prev => prev + enemy.experienceValue);

    return true; // Enemy was killed
  }

  return false; // Enemy survived
};

