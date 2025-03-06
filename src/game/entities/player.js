// Player entity and functions
import { allUpgrades } from '../config';

// Initialize player state
export const playerInit = () => {
  return {
    x: 400,
    y: 300,
    width: 40,
    height: 40,
    weapons: [{
      type: 'wand',
      level: 1,
      cooldown: 1000,
      lastFired: 0,
      projectiles: [],
    }],
    direction: 'down',
    lastMove: 0,
    isMoving: false,
    frameCount: 0,
    frameDelay: 8,
    currentFrame: 0,
  };
};

// Handle player movement
// Update this function in your player.js file

export const updatePlayerPosition = (player, playerStats, keysPressed, canvas, camera) => {
  let dx = 0;
  let dy = 0;
  
  // Handle input
  if (keysPressed['w'] || keysPressed['arrowup']) {
    dy -= playerStats.speed;
    player.direction = 'up';
    player.isMoving = true;
  }
  if (keysPressed['s'] || keysPressed['arrowdown']) {
    dy += playerStats.speed;
    player.direction = 'down';
    player.isMoving = true;
  }
  if (keysPressed['a'] || keysPressed['arrowleft']) {
    dx -= playerStats.speed;
    player.direction = 'left';
    player.isMoving = true;
  }
  if (keysPressed['d'] || keysPressed['arrowright']) {
    dx += playerStats.speed;
    player.direction = 'right';
    player.isMoving = true;
  }
  
  // Only update isMoving if there is input
  if (dx === 0 && dy === 0) {
    player.isMoving = false;
  }
  
  // Normalize diagonal movement
  if (dx !== 0 && dy !== 0) {
    const length = Math.sqrt(dx * dx + dy * dy);
    dx = dx / length * playerStats.speed;
    dy = dy / length * playerStats.speed;
  }
  
  // Update player position
  player.x += dx;
  player.y += dy;
  
  // Return movement values for background parallax
  return { dx, dy };
};

// Apply a weapon upgrade to player
// Update to player.js - Enhanced applyWeaponUpgrade function

export const applyWeaponUpgrade = (player, upgradeId) => {
  const upgrade = allUpgrades.find(u => u.id === upgradeId);
  if (!upgrade) return;
  
  // Extract base weapon type and level
  const matches = upgradeId.match(/^([a-z]+)(\d*)$/);
  if (!matches) return;
  
  const weaponType = matches[1]; // e.g., 'wand', 'axe', 'fire', 'frost', 'lightning'
  const level = matches[2] ? parseInt(matches[2]) : 1; // e.g., 2, 3, or 1 if no number
  
  // Find if player already has this weapon type
  const existingWeapon = player.weapons.find(w => w.type === weaponType);
  
  if (existingWeapon) {
    // Update existing weapon level
    existingWeapon.level = level;
    console.log(`Upgraded ${weaponType} to level ${level}`);
  } else {
    // Add new weapon based on type
    const newWeapon = {
      type: weaponType,
      level: level,
      lastFired: 0,
      projectiles: []
    };
    
    // Set weapon-specific properties
    switch (weaponType) {
      case 'wand':
        newWeapon.cooldown = 1000;
        break;
      case 'axe':
        newWeapon.cooldown = 2000;
        break;
      case 'fire':
        newWeapon.cooldown = 500;
        newWeapon.radius = 50;
        delete newWeapon.projectiles;
        break;
      case 'frost':
        newWeapon.cooldown = 3000;
        newWeapon.radius = 80;
        newWeapon.duration = 2000; // Slow effect duration
        break;
      case 'lightning':
        newWeapon.cooldown = 2500;
        newWeapon.targetCount = 3; // Number of targets hit
        newWeapon.damage = 30;
        break;
    }
    
    player.weapons.push(newWeapon);
    console.log(`Added new weapon: ${weaponType} level ${level}`);
  }
};