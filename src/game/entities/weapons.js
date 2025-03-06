import { updateProjectileTrails } from '../utils/enhanced-projectiles';


// Weapon systems and projectile handling

// Update player weapons and projectiles
export const updateWeapons = (player, playerStats, currentTime, enemies, animation, onEnemyHit) => {
  player.weapons.forEach(weapon => {
    if (currentTime - weapon.lastFired >= weapon.cooldown * playerStats.cooldown) {
      // Time to fire
      console.log(`Firing weapon: ${weapon.type}, level: ${weapon.level}`);
      weapon.lastFired = currentTime;
      
      switch (weapon.type) {
        case 'wand':
          // Magic wand projectiles
          fireWandProjectiles(player, playerStats, weapon);
          break;
          
        case 'axe':
          // Throwing axe projectiles
          fireAxeProjectiles(player, playerStats, weapon);
          break;
          
        case 'frost':
          // Frost Nova ability
          fireFrostNova(player, playerStats, weapon, enemies, animation, onEnemyHit);
          break;
          
        case 'lightning':
          // Lightning Strike ability
          fireLightningStrike(player, playerStats, weapon, enemies, animation, onEnemyHit);
          break;
      }
    }
    
    // Continuous weapons (Fire Aura doesn't create projectiles)
    if (weapon.type === 'fire') {
      applyFireAuraDamage(player, playerStats, weapon, enemies, animation, onEnemyHit);
    }
    
    // Update projectiles if weapon has them
    if (weapon.projectiles) {
      updateProjectileTrails(weapon);

      weapon.projectiles = weapon.projectiles.filter(projectile => {
        // Move projectile
        projectile.x += Math.cos(projectile.angle) * projectile.speed;
        projectile.y += Math.sin(projectile.angle) * projectile.speed;
        
        // Update distance traveled
        const distance = projectile.speed;
        projectile.distanceTraveled += distance;
        
        // Update rotation for axes
        if (weapon.type === 'axe') {
          projectile.rotation += 0.2;
        }
        
        // Check for collision with enemies
        let hitEnemy = false;
        
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i];
          
          if (enemy.isDead) continue;
          
          // Check collision
          let hitboxRadius;
          if (weapon.type === 'wand') {
            hitboxRadius = projectile.radius;
          } else if (weapon.type === 'axe') {
            hitboxRadius = Math.max(projectile.width, projectile.height) / 2;
          }
          
          const dx = enemy.x + enemy.width / 2 - projectile.x;
          const dy = enemy.y + enemy.height / 2 - projectile.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < hitboxRadius + enemy.width / 2) {
            // Hit enemy
            const isCritical = Math.random() < (playerStats.critChance ? playerStats.critChance / 100 : 0.1);
            const critMultiplier = isCritical ? (playerStats.critDamage ? playerStats.critDamage / 100 : 2) : 1;
            const damage = projectile.damage * critMultiplier;
            
            // Add hit effect
            animation.effectFrames.push({
              x: projectile.x,
              y: projectile.y,
              type: 'hit',
              color: getProjectileColor(weapon.type),
              size: hitboxRadius,
              duration: 15,
              currentFrame: 0,
            });
            
            // Apply special effects based on weapon type
            if (projectile.effect) {
              applyProjectileEffect(enemy, projectile.effect, animation);
            }
            
            // Call hit handler
            onEnemyHit(enemy, damage, isCritical);
            
            // Wand projectiles disappear on hit, axes continue
            if (weapon.type === 'wand') {
              hitEnemy = true;
              break;
            }
          }
        }
        
        // Remove if hit enemy (for wand) or traveled too far
        return !hitEnemy && projectile.distanceTraveled < projectile.maxDistance;
      });
    }
  });
};

// Helper function to get projectile color based on weapon type
const getProjectileColor = (weaponType) => {
  switch (weaponType) {
    case 'wand': return 'rgba(0, 200, 255, 0.7)';
    case 'axe': return 'rgba(255, 100, 0, 0.7)';
    case 'frost': return 'rgba(100, 200, 255, 0.7)';
    case 'lightning': return 'rgba(180, 100, 255, 0.7)';
    default: return 'rgba(255, 255, 255, 0.7)';
  }
};

// Apply special effects to enemies
const applyProjectileEffect = (enemy, effect, animation) => {
  switch (effect.type) {
    case 'frost':
      // Slow the enemy
      if (!enemy.effects) enemy.effects = {};
      enemy.effects.frost = {
        duration: effect.duration,
        startTime: Date.now(),
        originalSpeed: enemy.speed,
      };
      enemy.speed *= 0.5; // 50% slow
      
      // Add frost visual effect
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * enemy.width * 0.6;
        
        animation.effectFrames.push({
          x: enemy.x + enemy.width / 2 + Math.cos(angle) * distance,
          y: enemy.y + enemy.height / 2 + Math.sin(angle) * distance,
          type: 'particle',
          color: 'rgba(100, 200, 255, 0.7)',
          size: 3 + Math.random() * 4,
          duration: 40 + Math.random() * 20,
          currentFrame: 0,
        });
      }
      break;
  }
};

// Fire wand projectiles (unchanged)
const fireWandProjectiles = (player, playerStats, weapon) => {
  // Determine firing direction based on player direction
  let fireDirection = player.direction;
  
  const baseAngle = fireDirection === 'right' ? 0 :
                   fireDirection === 'down' ? Math.PI / 2 :
                   fireDirection === 'left' ? Math.PI :
                   -Math.PI / 2;
  
  const numProjectiles = weapon.level;
  const angleSpread = Math.PI / 8; // 22.5 degrees spread (tighter grouping)
  
  for (let i = 0; i < numProjectiles; i++) {
    let angle = baseAngle;
    
    if (numProjectiles > 1) {
      const offset = angleSpread * (i - (numProjectiles - 1) / 2);
      angle += offset;
    }
    
    weapon.projectiles.push({
      x: player.x + player.width / 2,
      y: player.y + player.height / 2,
      radius: 5 * playerStats.area,
      angle: angle,
      speed: 6.5, // Increased projectile speed
      damage: playerStats.damage,
      distanceTraveled: 0,
      maxDistance: 350 * playerStats.area, // Increased range
      level: weapon.level // Add this line to pass the level information
    });
  }
};

// Fire axe projectiles (enhanced for level 3)
const fireAxeProjectiles = (player, playerStats, weapon) => {
  console.log("CREATING AXE PROJECTILES");
  const numAxes = weapon.level + 1;
  const baseAngle = Math.random() * Math.PI * 2; // Random starting angle
  
  // For level 3, we add a second wave of axes with delay
  const axeDamageMultiplier = weapon.level === 3 ? 1.3 : 1; // 30% more damage at level 3
  
  for (let i = 0; i < numAxes; i++) {
    const angle = baseAngle + (i * (Math.PI * 2) / numAxes);
    
    weapon.projectiles.push({
      x: player.x + player.width / 2,
      y: player.y + player.height / 2,
      width: 10 * playerStats.area,
      height: 10 * playerStats.area,
      angle: angle,
      speed: 3,
      damage: playerStats.damage * 1.5 * axeDamageMultiplier,
      distanceTraveled: 0,
      maxDistance: 200 * playerStats.area * (weapon.level >= 2 ? 1.2 : 1), // 20% more range at level 2+
      rotation: 0,
    });
  }
  
  // Add a second wave of axes for level 3
  if (weapon.level === 3) {
    // Schedule another wave in 500ms
    setTimeout(() => {
      // Make sure the weapon still exists when timeout fires
      if (!player.weapons.includes(weapon)) return;
      
      for (let i = 0; i < numAxes; i++) {
        const delayedAngle = baseAngle + Math.PI / numAxes + (i * (Math.PI * 2) / numAxes);
        
        weapon.projectiles.push({
          x: player.x + player.width / 2,
          y: player.y + player.height / 2,
          width: 10 * playerStats.area,
          height: 10 * playerStats.area,
          angle: delayedAngle,
          speed: 3,
          damage: playerStats.damage * 1.5 * axeDamageMultiplier,
          distanceTraveled: 0,
          maxDistance: 200 * playerStats.area * 1.2,
          rotation: 0,
        });
      }
    }, 500);
  }
};

// Apply damage from fire aura (enhanced for level 3)
const applyFireAuraDamage = (player, playerStats, weapon, enemies, animation, onEnemyHit) => {
  // Scale radius and damage with level
  const levelMultiplier = weapon.level === 2 ? 1.2 : weapon.level === 3 ? 1.5 : 1;
  const radius = weapon.radius * playerStats.area * levelMultiplier;
  
  enemies.forEach(enemy => {
    const dx = enemy.x + enemy.width / 2 - (player.x + player.width / 2);
    const dy = enemy.y + enemy.height / 2 - (player.y + player.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < radius + enemy.width / 2) {
      // Calculate damage based on fire aura level
      const baseDamage = playerStats.damage * 0.2;
      const levelDamageMultiplier = weapon.level === 2 ? 1.5 : weapon.level === 3 ? 2.0 : 1;
      const damageAmount = baseDamage * levelDamageMultiplier;
      
      // Level 3 does damage more frequently
      const damageFrequency = weapon.level === 3 ? 0.1 : 0.05;
      
      // Add damage text for fire aura occasionally
      if (Math.random() < damageFrequency) {
        onEnemyHit(enemy, damageAmount, false);
        
        // Occasionally add flame particles
        if (Math.random() < 0.2) {
          const angle = Math.random() * Math.PI * 2;
          const particleDistance = Math.random() * radius * 0.8;
          const particleX = player.x + player.width / 2 + Math.cos(angle) * particleDistance;
          const particleY = player.y + player.height / 2 + Math.sin(angle) * particleDistance;
          
          // More intense colors for higher levels
          const flameColor = weapon.level === 3 ? 
                            (Math.random() < 0.3 ? 'rgba(255, 255, 100, 0.8)' : 'rgba(255, 80, 0, 0.8)') : 
                            (Math.random() < 0.5 ? 'rgba(255, 200, 0, 0.8)' : 'rgba(255, 100, 0, 0.8)');
          
          animation.effectFrames.push({
            x: particleX,
            y: particleY,
            type: 'flame',
            color: flameColor,
            size: 3 + Math.random() * 5,
            duration: 10 + Math.random() * 10,
            currentFrame: 0,
            angle: -Math.PI / 2 + (Math.random() * 0.5 - 0.25),
            speed: 0.5 + Math.random() * 1,
          });
        }
      }
    }
  });
};

// New Frost Nova ability
const fireFrostNova = (player, playerStats, weapon, enemies, animation, onEnemyHit) => {
  // Calculate radius based on level and area
  const radius = weapon.radius * playerStats.area * (weapon.level === 2 ? 1.3 : 1);
  const frostDuration = weapon.duration * (weapon.level === 2 ? 1.5 : 1); // 50% longer freeze at level 2
  
  // Add frost explosion visual effect
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius;
    
    animation.effectFrames.push({
      x: player.x + player.width / 2 + Math.cos(angle) * distance,
      y: player.y + player.height / 2 + Math.sin(angle) * distance,
      type: 'particle',
      color: 'rgba(100, 200, 255, 0.7)',
      size: 4 + Math.random() * 5,
      duration: 30 + Math.random() * 20,
      currentFrame: 0,
    });
  }
  
  // Create a frost shockwave
  animation.effectFrames.push({
    x: player.x + player.width / 2,
    y: player.y + player.height / 2,
    type: 'hit',
    color: 'rgba(100, 200, 255, 0.7)',
    size: radius,
    duration: 15,
    currentFrame: 0,
  });
  
  // Apply damage and frost effect to enemies in range
  enemies.forEach(enemy => {
    const dx = enemy.x + enemy.width / 2 - (player.x + player.width / 2);
    const dy = enemy.y + enemy.height / 2 - (player.y + player.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < radius + enemy.width / 2) {
      // Apply damage
      const baseDamage = playerStats.damage * (weapon.level === 2 ? 1.2 : 0.8);
      const isCritical = Math.random() < (playerStats.critChance ? playerStats.critChance / 100 : 0.1);
      const critMultiplier = isCritical ? (playerStats.critDamage ? playerStats.critDamage / 100 : 2) : 1;
      const damage = baseDamage * critMultiplier;
      
      onEnemyHit(enemy, damage, isCritical);
      
      // Apply frost effect to slow enemy
      if (!enemy.effects) enemy.effects = {};
      
      // Store original speed if not already slowed
      if (!enemy.effects.frost) {
        enemy.effects.frost = {
          originalSpeed: enemy.speed,
          startTime: Date.now(),
          duration: frostDuration,
        };
        enemy.speed *= 0.5; // 50% slow
      } else {
        // Just reset the duration if already slowed
        enemy.effects.frost.startTime = Date.now();
        enemy.effects.frost.duration = frostDuration;
      }
      
      // Add frost visual effect to enemy
      for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = enemy.width * 0.5 * Math.random();
        
        animation.effectFrames.push({
          x: enemy.x + enemy.width / 2 + Math.cos(angle) * dist,
          y: enemy.y + enemy.height / 2 + Math.sin(angle) * dist,
          type: 'particle',
          color: 'rgba(100, 220, 255, 0.8)',
          size: 2 + Math.random() * 3,
          duration: 20 + Math.random() * 20,
          currentFrame: 0,
        });
      }
      
      // Level 2 adds ice shards effect
      if (weapon.level >= 2) {
        // Create ice shards that linger
        setTimeout(() => {
          const shardCount = 3;
          for (let i = 0; i < shardCount; i++) {
            const shardAngle = Math.random() * Math.PI * 2;
            const shardDist = enemy.width * 1.5;
            const shardX = enemy.x + enemy.width / 2 + Math.cos(shardAngle) * shardDist;
            const shardY = enemy.y + enemy.height / 2 + Math.sin(shardAngle) * shardDist;
            
            // Add to animation effects
            animation.effectFrames.push({
              x: shardX,
              y: shardY,
              type: 'particle',
              color: 'rgba(150, 240, 255, 0.7)',
              size: 5 + Math.random() * 3,
              duration: 60 + Math.random() * 30,
              currentFrame: 0,
            });
          }
        }, 300); // Delay for visual effect
      }
    }
  });
};

// New Lightning Strike ability
const fireLightningStrike = (player, playerStats, weapon, enemies, animation, onEnemyHit) => {
  // Find target enemies
  const targetCount = weapon.targetCount || 3;
  const potentialTargets = enemies.filter(enemy => !enemy.isDead);
  
  // If no enemies, do nothing
  if (potentialTargets.length === 0) return;
  
  // Choose random targets
  const targets = [];
  for (let i = 0; i < Math.min(targetCount, potentialTargets.length); i++) {
    const randomIndex = Math.floor(Math.random() * potentialTargets.length);
    targets.push(potentialTargets[randomIndex]);
    potentialTargets.splice(randomIndex, 1); // Remove from potential targets
  }
  
  // Strike each target
  targets.forEach((target, index) => {
    // Calculate damage
    const baseDamage = playerStats.damage * 1.5;
    const isCritical = Math.random() < (playerStats.critChance ? playerStats.critChance / 100 : 0.1);
    const critMultiplier = isCritical ? (playerStats.critDamage ? playerStats.critDamage / 100 : 2) : 1;
    const damage = baseDamage * critMultiplier;
    
    // Slight delay between strikes for visual effect
    setTimeout(() => {
      // Lightning bolt from sky
      const targetX = target.x + target.width / 2;
      const targetY = target.y + target.height / 2;
      
      // Create lightning effect - vertical bolt
      for (let i = 0; i < 10; i++) {
        const yOffset = -300 + i * 30; // Starting high above
        const xVariation = (Math.random() - 0.5) * 10; // Some zigzag
        
        animation.effectFrames.push({
          x: targetX + xVariation,
          y: targetY + yOffset,
          type: 'particle',
          color: 'rgba(180, 180, 255, 0.8)',
          size: 3 + Math.random() * 3,
          duration: 10 + Math.random() * 5,
          currentFrame: 0,
        });
      }
      
      // Impact effect
      animation.effectFrames.push({
        x: targetX,
        y: targetY,
        type: 'hit',
        color: 'rgba(180, 100, 255, 0.7)',
        size: target.width,
        duration: 15,
        currentFrame: 0,
      });
      
      // Additional particles at impact
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * target.width;
        
        animation.effectFrames.push({
          x: targetX + Math.cos(angle) * distance,
          y: targetY + Math.sin(angle) * distance,
          type: 'particle',
          color: 'rgba(200, 150, 255, 0.8)',
          size: 2 + Math.random() * 4,
          duration: 20 + Math.random() * 10,
          currentFrame: 0,
        });
      }
      
      // Apply damage
      onEnemyHit(target, damage, isCritical);
      
      // Chain lightning to nearby enemies (if available)
      if (index < targets.length - 1) {
        const nextTarget = targets[index + 1];
        const nextX = nextTarget.x + nextTarget.width / 2;
        const nextY = nextTarget.y + nextTarget.height / 2;
        
        // Create chain lightning effect
        const distance = Math.sqrt(
          Math.pow(nextX - targetX, 2) + 
          Math.pow(nextY - targetY, 2)
        );
        
        const segments = Math.ceil(distance / 20);
        
        for (let i = 0; i < segments; i++) {
          const progress = i / segments;
          const xPos = targetX + (nextX - targetX) * progress;
          const yPos = targetY + (nextY - targetY) * progress;
          
          // Add some randomness to make it look like lightning
          const xOffset = (Math.random() - 0.5) * 15;
          const yOffset = (Math.random() - 0.5) * 15;
          
          animation.effectFrames.push({
            x: xPos + xOffset,
            y: yPos + yOffset,
            type: 'particle',
            color: 'rgba(180, 150, 255, 0.7)',
            size: 3 + Math.random() * 2,
            duration: 10 + Math.random() * 5,
            currentFrame: 0,
          });
        }
      }
    }, index * 150); // Stagger the lightning strikes
  });
};

// Update enemy effects - Call this in your engine.js updateEnemies function
export const updateEnemyEffects = (enemy) => {
  if (!enemy.effects) return;
  
  // Update frost effect
  if (enemy.effects.frost) {
    const elapsed = Date.now() - enemy.effects.frost.startTime;
    
    // If effect expired, remove it
    if (elapsed > enemy.effects.frost.duration) {
      enemy.speed = enemy.effects.frost.originalSpeed;
      delete enemy.effects.frost;
    }
  }
  
  // Add other effects here as needed
};