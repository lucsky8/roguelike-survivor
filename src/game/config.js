// Game configuration
// good one 

// Game configuration - Enhanced Upgrades
// Upgrade definitions with improved effects, balance, and descriptions

export const allUpgrades = [
  // WEAPON UPGRADES
  // Magic Wand Upgrades
  { 
    id: 'wand2', 
    name: 'Magic Wand II', 
    description: 'Fires two magical projectiles with increased damage.', 
    type: 'weapon', 
    rarity: 'common',
    icon: '🪄',
    color: '#00CCFF',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        damage: prev.damage * 1.1 // Small damage boost with upgrade
      }));
    }
  },
  { 
    id: 'wand3', 
    name: 'Magic Wand III', 
    description: 'Fires three magical projectiles in a wider arc with arcane resonance.', 
    type: 'weapon', 
    rarity: 'rare',
    icon: '✨',
    color: '#00FFFF',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        damage: prev.damage * 1.15 // Additional damage boost
      }));
    }
  },
  
  // Throwing Axe Upgrades
  { 
    id: 'axe', 
    name: 'Throwing Axe', 
    description: 'Throws spinning axes that orbit around you before striking enemies.', 
    type: 'weapon', 
    rarity: 'common',
    icon: '🪓',
    color: '#FF6347',
    effect: (setPlayerStats) => {
      // No stat changes, just adds the weapon
    }
  },
  { 
    id: 'axe2', 
    name: 'Throwing Axe II', 
    description: 'Throws more axes with increased sharpness and penetration.', 
    type: 'weapon', 
    rarity: 'uncommon',
    icon: '⚔️',
    color: '#FF4500',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        damage: prev.damage * 1.1 // Small damage boost with upgrade
      }));
    }
  },
  { 
    id: 'axe3', 
    name: 'Throwing Axe III', 
    description: 'Throws a flurry of enchanted axes with extended range and critical hit chance.', 
    type: 'weapon', 
    rarity: 'rare',
    icon: '🔥',
    color: '#FF2400',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        damage: prev.damage * 1.15, // Additional damage boost
        area: prev.area * 1.05 // Slight area boost
      }));
    }
  },
  
  // Fire Aura Upgrades
  { 
    id: 'fire', 
    name: 'Fire Aura', 
    description: 'Creates a damaging aura of flames around you that burns nearby enemies.', 
    type: 'weapon', 
    rarity: 'uncommon',
    icon: '🔥',
    color: '#FFA500',
    effect: (setPlayerStats) => {
      // No stat changes, just adds the weapon
    }
  },
  { 
    id: 'fire2', 
    name: 'Fire Aura II', 
    description: 'Increases the size and intensity of your fire aura with searing heat.', 
    type: 'weapon', 
    rarity: 'rare',
    icon: '🌋',
    color: '#FF4500',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        area: prev.area * 1.05, // Small area boost
        damage: prev.damage * 1.05 // Small damage boost
      }));
    }
  },
  { 
    id: 'fire3', 
    name: 'Fire Aura III', 
    description: 'Transforms your aura into raging inferno that causes massive burn damage.', 
    type: 'weapon', 
    rarity: 'epic',
    icon: '☀️',
    color: '#FF0000',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        area: prev.area * 1.1, // Larger area boost
        damage: prev.damage * 1.15 // Larger damage boost
      }));
    }
  },
  
  // NEW WEAPON: Frost Nova
  { 
    id: 'frost', 
    name: 'Frost Nova', 
    description: 'Periodically erupts in a burst of ice that slows and damages enemies.', 
    type: 'weapon', 
    rarity: 'uncommon',
    icon: '❄️',
    color: '#00BFFF',
    effect: (setPlayerStats) => {
      // No stat changes, just adds the weapon
    }
  },
  { 
    id: 'frost2', 
    name: 'Frost Nova II', 
    description: 'Increases freeze duration and creates lingering ice shards on impact.', 
    type: 'weapon', 
    rarity: 'rare',
    icon: '🧊',
    color: '#1E90FF',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        area: prev.area * 1.05, // Small area boost
        cooldown: prev.cooldown * 0.95 // Slight cooldown reduction
      }));
    }
  },
  
  // NEW WEAPON: Lightning Strike
  { 
    id: 'lightning', 
    name: 'Lightning Strike', 
    description: 'Calls down lightning bolts on random enemies with chain damage.', 
    type: 'weapon', 
    rarity: 'rare',
    icon: '⚡',
    color: '#9370DB',
    effect: (setPlayerStats) => {
      // No stat changes, just adds the weapon
    }
  },
  
  // PASSIVE UPGRADES
  // Defensive Upgrades
  { 
    id: 'health', 
    name: 'Max Health Up', 
    description: 'Increases maximum health by 20 points and restores to full.', 
    type: 'passive', 
    rarity: 'common',
    icon: '❤️',
    color: '#FF5555',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        maxHealth: prev.maxHealth + 20,
        health: prev.maxHealth + 20, // Full heal with upgrade
      }));
    }
  },
  { 
    id: 'health2', 
    name: 'Max Health Up II', 
    description: 'Increases maximum health by 30 points and restores to full.', 
    type: 'passive', 
    rarity: 'uncommon',
    icon: '❤️❤️',
    color: '#FF3333',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        maxHealth: prev.maxHealth + 30,
        health: prev.maxHealth + 30, // Full heal with upgrade
      }));
    }
  },
  { 
    id: 'regeneration', 
    name: 'Health Regeneration', 
    description: 'Slowly regenerates health over time.', 
    type: 'passive', 
    rarity: 'rare',
    icon: '💗',
    color: '#FF69B4',
    effect: (setPlayerStats) => {
      // This would need a system to actually apply regeneration over time
      setPlayerStats(prev => ({
        ...prev,
        regeneration: (prev.regeneration || 0) + 1,
        health: Math.min(prev.health + 20, prev.maxHealth), // Immediate small heal
      }));
    }
  },
  { 
    id: 'armor', 
    name: 'Arcane Armor', 
    description: 'Reduces damage taken by 10% with a magical barrier.', 
    type: 'passive', 
    rarity: 'uncommon',
    icon: '🛡️',
    color: '#4169E1',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        armor: (prev.armor || 0) + 10, // 10% damage reduction
      }));
    }
  },
  
  // Movement Upgrades
  { 
    id: 'speed', 
    name: 'Movement Speed Up', 
    description: 'Increases movement speed by 10%.', 
    type: 'passive', 
    rarity: 'common',
    icon: '👟',
    color: '#98FB98',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        speed: prev.speed * 1.1,
      }));
    }
  },
  { 
    id: 'speed2', 
    name: 'Movement Speed Up II', 
    description: 'Increases movement speed by 15% with enhanced agility.', 
    type: 'passive', 
    rarity: 'uncommon',
    icon: '🏃',
    color: '#00FF7F',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        speed: prev.speed * 1.15,
      }));
    }
  },
  { 
    id: 'dash', 
    name: 'Arcane Dash', 
    description: 'Periodically dash through enemies when taking damage, becoming briefly invulnerable.', 
    type: 'passive', 
    rarity: 'rare',
    icon: '💨',
    color: '#87CEFA',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        dashChance: (prev.dashChance || 0) + 20, // 20% chance to dash on hit
        speed: prev.speed * 1.05, // Small speed boost
      }));
    }
  },
  
  // Offensive Upgrades
  { 
    id: 'damage', 
    name: 'Damage Up', 
    description: 'Increases all damage dealt by 15%.', 
    type: 'passive', 
    rarity: 'common',
    icon: '⚔️',
    color: '#FF4500',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        damage: prev.damage * 1.15,
      }));
    }
  },
  { 
    id: 'damage2', 
    name: 'Damage Up II', 
    description: 'Increases all damage dealt by 20% with enhanced focus.', 
    type: 'passive', 
    rarity: 'uncommon',
    icon: '🗡️',
    color: '#FF0000',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        damage: prev.damage * 1.2,
      }));
    }
  },
  { 
    id: 'critical', 
    name: 'Critical Strike', 
    description: 'Gain 10% chance to deal double damage with attacks.', 
    type: 'passive', 
    rarity: 'rare',
    icon: '✨',
    color: '#FFD700',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        critChance: (prev.critChance || 0) + 10, // 10% crit chance
        critDamage: (prev.critDamage || 200) + 0, // 200% damage on crit
      }));
    }
  },
  
  // Weapon Enhancements
  { 
    id: 'area', 
    name: 'Area Up', 
    description: 'Increases attack area by 10% with expanded magical reach.', 
    type: 'passive', 
    rarity: 'common',
    icon: '⭕',
    color: '#DDA0DD',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        area: prev.area * 1.1,
      }));
    }
  },
  { 
    id: 'area2', 
    name: 'Area Up II', 
    description: 'Increases attack area by 15% with vastly expanded magical field.', 
    type: 'passive', 
    rarity: 'uncommon',
    icon: '🔄',
    color: '#BA55D3',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        area: prev.area * 1.15,
      }));
    }
  },
  { 
    id: 'cooldown', 
    name: 'Cooldown Reduction', 
    description: 'Reduces attack cooldown by 10% for all weapons.', 
    type: 'passive', 
    rarity: 'common',
    icon: '⏱️',
    color: '#00CED1',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        cooldown: prev.cooldown * 0.9,
      }));
    }
  },
  { 
    id: 'cooldown2', 
    name: 'Cooldown Reduction II', 
    description: 'Reduces attack cooldown by 15% for all weapons with enhanced efficiency.', 
    type: 'passive', 
    rarity: 'uncommon',
    icon: '⚡',
    color: '#20B2AA',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        cooldown: prev.cooldown * 0.85,
      }));
    }
  },
  { 
    id: 'duration', 
    name: 'Duration Up', 
    description: 'Increases the duration of all weapon effects by 20%.', 
    type: 'passive', 
    rarity: 'uncommon',
    icon: '⏳',
    color: '#9370DB',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        duration: (prev.duration || 1) * 1.2,
      }));
    }
  },
  
  // Utility & Resources
  { 
    id: 'magnet', 
    name: 'Experience Magnet', 
    description: 'Increases gem pickup radius by 25%.', 
    type: 'passive', 
    rarity: 'common',
    icon: '🧲',
    color: '#00FF7F',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        magnetRadius: (prev.magnetRadius || 1) * 1.25,
      }));
    }
  },
  { 
    id: 'luck', 
    name: 'Fortune Charm', 
    description: 'Increases the chance of enemies dropping gems by 15%.', 
    type: 'passive', 
    rarity: 'uncommon',
    icon: '🍀',
    color: '#7CFC00',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        dropChance: (prev.dropChance || 0) + 15,
      }));
    }
  },
  { 
    id: 'heal', 
    name: 'Healing Potion', 
    description: 'Immediately restores 30 health points.', 
    type: 'passive', 
    rarity: 'common',
    icon: '🧪',
    color: '#FF69B4',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        health: Math.min(prev.health + 30, prev.maxHealth),
      }));
    }
  },
  { 
    id: 'revive', 
    name: 'Second Chance', 
    description: 'When you would die, survive once with 20% health.', 
    type: 'passive', 
    rarity: 'epic',
    icon: '✨',
    color: '#FFD700',
    effect: (setPlayerStats) => {
      setPlayerStats(prev => ({
        ...prev,
        reviveCount: (prev.reviveCount || 0) + 1,
      }));
    }
  }
];


// Select upgrades based on weighted rarity and availability
export const selectRandomUpgrades = (availableUpgrades, count, currentLevel) => {
  const rarityData = getUpgradesByRarity(currentLevel);
  const results = [];
  
  // Clone array to avoid modifying the original
  const available = [...availableUpgrades];
  
  for (let i = 0; i < count && available.length > 0; i++) {
    // Determine rarity based on weights
    const roll = Math.random() * 100;
    let selectedRarity;
    let cumulativeWeight = 0;
    
    for (const [rarity, weight] of Object.entries(rarityData.weights)) {
      cumulativeWeight += weight;
      if (roll <= cumulativeWeight) {
        selectedRarity = rarity;
        break;
      }
    }
    
    // Filter by selected rarity
    const rarityPool = available.filter(u => u.rarity === selectedRarity);
    
    // If no upgrades of this rarity, fall back to any rarity
    const pool = rarityPool.length > 0 ? rarityPool : available;
    
    if (pool.length > 0) {
      const index = Math.floor(Math.random() * pool.length);
      results.push(pool[index]);
      
      // Remove selected upgrade to avoid duplicates
      const selectedId = pool[index].id;
      const globalIndex = available.findIndex(u => u.id === selectedId);
      if (globalIndex !== -1) {
        available.splice(globalIndex, 1);
      }
    }
  }
  
  return results;
  };

// Helper function to get upgrades by rarity for weighted selection
export const getUpgradesByRarity = (currentLevel) => {
// Rarity weights change as player progresses
const weights = {
  common: Math.max(70 - currentLevel * 3, 30),     // Decrease from 70% to 30%
  uncommon: Math.min(20 + currentLevel * 1.5, 40), // Increase from 20% to 40%
  rare: Math.min(9 + currentLevel * 1, 25),        // Increase from 9% to 25%
  epic: Math.min(1 + currentLevel * 0.5, 5)        // Increase from 1% to 5%
};

return {
  common: allUpgrades.filter(u => u.rarity === 'common'),
  uncommon: allUpgrades.filter(u => u.rarity === 'uncommon'),
  rare: allUpgrades.filter(u => u.rarity === 'rare'),
  epic: allUpgrades.filter(u => u.rarity === 'epic'),
  weights
};
};


  
  // Modify the stage configs to use darker backgrounds
export const stageConfigs = [
  {
    name: "The Beginning",
    message: "Stage 1: The Forest of Shadows",
    duration: 120000, // 2 minutes
    enemyTypes: ['ghost'],
    spawnRate: 0.1,
    bossType: 'boss',
    bossName: "Bone Colossus",
    bossHealth: 1000,
    background: {
      color: '#050510' // Darker blue background
    }
  },
  {
    name: "The Caverns",
    message: "Stage 2: The Forgotten Caverns",
    duration: 120000, // 2 minutes
    enemyTypes: ['zombie', 'skeleton'],
    spawnRate: 0.015,
    background: {
      color: '#0a0a14' // Dark blue-purple background
    }
  },
  {
    name: "The Catacombs",
    message: "Stage 3: Ancient Catacombs",
    duration: 120000,
    enemyTypes: ['zombie', 'skeleton', 'ghost'],
    spawnRate: 0.02,
    background: {
      color: '#0f0a14' // Dark purple background
    },
    bossType: 'boss',
    bossName: "Bone Colossus",
    bossHealth: 1000
  },
  {
    name: "The Abyss",
    message: "Stage 4: The Endless Abyss",
    duration: 120000,
    enemyTypes: ['skeleton', 'ghost'],
    spawnRate: 0.025,
    background: {
      color: '#080814' // Very dark blue
    }
  },
  {
    name: "The Void",
    message: "Stage 5: The Void of Souls",
    duration: 120000,
    enemyTypes: ['ghost', 'boss'],
    spawnRate: 0.03,
    background: {
      color: '#050510' // Dark blue-black
    },
    bossType: 'boss',
    bossName: "Void Harbinger",
    bossHealth: 2000
  },
  {
    name: "Endless",
    message: "Final Stage: Endless Nightmare",
    duration: Infinity,
    enemyTypes: ['zombie', 'skeleton', 'ghost', 'boss'],
    spawnRate: 0.035,
    background: {
      color: '#03030a' // Nearly black
    },
    bossSpawnInterval: 60000, // Boss every minute
    bossType: 'boss',
    bossName: "Nightmare Lord",
    bossHealth: 3000
  }
];
  
  // Enemy types
  export const enemyTypes = [
    { 
      type: 'zombie', 
      health: 30, 
      damage: 10, 
      speed: 1, 
      experienceValue: 10,
      color: '#5cb85c',
      width: 35,
      height: 45,
      animationFrames: 4,
      animationSpeed: 12,
    },
    { 
      type: 'ghost', 
      health: 15, 
      damage: 5, 
      speed: 1.5, 
      experienceValue: 15,
      color: '#d9d9d9',
      width: 30,
      height: 40,
      animationFrames: 4,
      animationSpeed: 16
      
    },
    { 
      type: 'skeleton', 
      health: 20, 
      damage: 8, 
      speed: 1.2, 
      experienceValue: 12,
      color: '#f0ad4e',
      width: 32,
      height: 42,
      animationFrames: 4,
      animationSpeed: 14,
    },
    {
      type: 'basic',
      health: 50,
      speed: 1.2,
      damage: 5,
      color: 'green',
      width: 30,
      height: 30,
    },
    {
      type: 'fast',
      health: 30,
      speed: 2.5, // Moves faster
      damage: 4,
      color: 'yellow',
      width: 25,
      height: 25,
    },
    {
      type: 'tank',
      health: 120, // Takes more hits
      speed: 0.8, // Moves slower
      damage: 8,
      color: 'darkred',
      width: 40,
      height: 40,
    },
    {
      type: 'ranged',
      health: 40,
      speed: 1,
      damage: 3,
      color: 'blue',
      width: 28,
      height: 28,
      attackCooldown: 2000, // Shoots every 2 seconds
      attackRange: 200, // Stops and shoots at this range
    },
    {
      type: 'exploder',
      health: 20,
      speed: 1.5,
      damage: 20, // Explodes on contact
      color: 'orange',
      width: 30,
      height: 30,
      explodesOnDeath: true, // Special property
    },
    { 
    type: 'boss',
    color: '#FF0000',
    width: 100,
    height: 100,
    health: 500, // Much higher health
    speed: 1,
    damage: 20,
    experienceValue: 100,
    animationFrames: 4, 
    animationSpeed: 8
    },
  ];