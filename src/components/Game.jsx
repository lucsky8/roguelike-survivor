import React, { useState, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import UpgradeMenu from './UI/UpgradeMenu';
import GameOverScreen from './UI/GameOverScreen';
import MainMenu from './UI/MainMenu';
import PauseMenu from './UI/PauseMenu';
import MobilePauseButton from './UI/MobilePauseButton';
import { allUpgrades, selectRandomUpgrades, stageConfigs } from '../game/config';

const Game = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameOver
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [experienceToNextLevel, setExperienceToNextLevel] = useState(100);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [stage, setStage] = useState(1);
  const [upgrades, setUpgrades] = useState([]);
  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false);
  const [upgradeOptions, setUpgradeOptions] = useState([]);
  const [stageMessage, setStageMessage] = useState('');
  const [showStageMessage, setShowStageMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [playerStats, setPlayerStats] = useState({
    health: 150,
    maxHealth: 150,
    speed: 3.5,
    damage: 18,
    area: 1.2,
    cooldown: 0.8,
  });
  // Add camera state
  const [camera, setCamera] = useState({
    zoom: 1,               // Default regular zoom
    minZoom: 0.4,          // Maximum zoom out
    maxZoom: 1.5,          // Maximum zoom in
    targetZoom: 1,         // Target zoom (for smooth transitions)
    zoomSpeed: 0.05,       // How quickly zoom changes
  });

  // Inside the component, add:
  {isMobile && gameState === 'playing' && (
    <MobilePauseButton onPause={pauseGame} />
  )}

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const ua = navigator.userAgent;
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(ua));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Set meta viewport for mobile devices - Using useEffect without causing linting errors
  React.useEffect(() => {
    if (isMobile) {
      // Find existing viewport meta or create one
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        document.head.appendChild(viewportMeta);
      }
      
      // Set content to prevent pinch zooming for better game experience
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      
      // Prevent document scrolling on touch devices
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.touchAction = 'none';
      
      return () => {
        viewportMeta.content = 'width=device-width, initial-scale=1.0';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.touchAction = '';
      };
    }
  }, [isMobile]);

  const startGame = () => {
    setGameState('playing');
    setLevel(1);
    setExperience(0);
    setExperienceToNextLevel(100);
    setScore(0);
    setTime(0);
    setStage(1);
    setShowStageMessage(true);
    setStageMessage(stageConfigs[0].message);
    setUpgrades([]);
    setShowUpgradeMenu(false);
    setPlayerStats({
      health: 150,
      maxHealth: 150,
      speed: 3.5,
      damage: 18,
      area: 1.2,
      cooldown: 0.8,
      regeneration: 1
    });
    
    // Adjust initial zoom based on device type
    const targetZoom = isMobile ? 0.5 : 0.65; // More zoomed out on mobile for better view
    
    setCamera({
      zoom: targetZoom,       // Start at the target zoom
      minZoom: 0.4,           // Maximum zoom out
      maxZoom: 1.5,           // Maximum zoom in
      targetZoom: targetZoom, // Default zoom level (adjusted for device)
      zoomSpeed: 0.05,        // How quickly zoom changes
    });
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  const pauseGame = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    }
  };

  const selectUpgrade = (upgrade) => {
    // Apply the upgrade effect
    upgrade.effect(setPlayerStats);
    
    // Add to selected upgrades
    setUpgrades([...upgrades, upgrade.id]);
    
    // Close upgrade menu and resume game
    setShowUpgradeMenu(false);
    setGameState('playing');
  };

  const handleLevelUp = () => {
    // Get available upgrades the player can select from
    const availableUpgrades = allUpgrades.filter(upgrade => {
      if (upgrade.type === 'weapon') {
        if (upgrade.id.includes('2') || upgrade.id.includes('3')) {
          // Extract base weapon type and level
          const matches = upgrade.id.match(/^([a-z]+)(\d+)$/);
          if (!matches) return false;
          
          const baseName = matches[1];
          const currentLevel = parseInt(matches[2]);
          const previousLevel = currentLevel - 1;
          const previousUpgradeId = previousLevel > 1 ? `${baseName}${previousLevel}` : baseName;
          
          return upgrades.includes(previousUpgradeId);
        }
        return !upgrades.includes(upgrade.id);
      }
      return upgrade.type === 'passive';
    });
    
    // Use weighted selection to get 3 options based on player level
    const options = selectRandomUpgrades(availableUpgrades, 3, level);
    
    setUpgradeOptions(options);
    setShowUpgradeMenu(true);
    setGameState('paused');
  };

  return (
    <div className="flex flex-col items-center h-full w-full bg-gray-900 text-white p-4">
     
      <div className="relative game-container">
      <GameCanvas 
        gameState={gameState}
        setGameState={setGameState}
        level={level}
        setLevel={setLevel}
        experience={experience}
        setExperience={setExperience}
        experienceToNextLevel={experienceToNextLevel}
        setExperienceToNextLevel={setExperienceToNextLevel}
        score={score}
        setScore={setScore}
        time={time}
        setTime={setTime}
        stage={stage}
        setStage={setStage}
        stageMessage={stageMessage}
        setStageMessage={setStageMessage}
        showStageMessage={showStageMessage}
        setShowStageMessage={setShowStageMessage}
        playerStats={playerStats}
        setPlayerStats={setPlayerStats}
        upgrades={upgrades}
        onLevelUp={handleLevelUp}
        camera={camera}
        setCamera={setCamera}
      />
        
        {gameState === 'menu' && (
          <MainMenu onStartGame={startGame} />
        )}
        
        {gameState === 'paused' && !showUpgradeMenu && (
          <PauseMenu 
            onResume={resumeGame}
            onQuit={() => setGameState('menu')}
            playerStats={playerStats}
            playerWeapons={deriveWeaponInfoFromUpgrades(upgrades)}
            upgrades={upgrades}
          />
        )}
        
        {showUpgradeMenu && (
          <UpgradeMenu 
            options={upgradeOptions} 
            onSelect={selectUpgrade} 
          />
        )}
        
        {gameState === 'gameOver' && (
          <GameOverScreen 
            score={score}
            time={time}
            stage={stage}
            level={level}
            onPlayAgain={startGame}
          />
        )}
      </div>
      
      <div className="mt-4 text-gray-400 text-center">
        <p>Controls: WASD or Arrow Keys to move. ESC to pause. +/- to zoom in/out.</p>
        <p className="mt-2 text-xs text-gray-500">Collect gems to gain experience and level up. Survive as long as you can!</p>
      </div>
    </div>
  );
};

// Helper function to derive weapon info from upgrades
const deriveWeaponInfoFromUpgrades = (upgradeList) => {
  // Identify weapon upgrades
  const weaponUpgrades = upgradeList.filter(id => {
    const upgrade = allUpgrades.find(u => u.id === id);
    return upgrade && upgrade.type === 'weapon';
  });
  
  // Convert to weapon objects
  const weapons = [];
  const weaponMap = {}; // Track highest level per weapon type
  
  weaponUpgrades.forEach(id => {
    // Extract type and level
    const matches = id.match(/^([a-z]+)(\d*)$/);
    if (!matches) return;
    
    const type = matches[1]; // e.g., "wand", "axe"
    const level = matches[2] ? parseInt(matches[2]) : 1;
    
    // Keep only the highest level weapon of each type
    if (!weaponMap[type] || level > weaponMap[type]) {
      weaponMap[type] = level;
    }
  });
  
  // Create simplified weapon objects
  Object.entries(weaponMap).forEach(([type, level]) => {
    weapons.push({ type, level });
  });
  
  return weapons;
};

export default Game;