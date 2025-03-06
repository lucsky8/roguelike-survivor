// Add these imports if they're not already present
import { useEffect, useRef } from 'react';
import { playerInit } from '../game/entities/player';
import { initGameEngine, updateGame, renderGame } from '../game/engine';

const GameCanvas = ({
  gameState, setGameState,
  level, setLevel,
  experience, setExperience,
  experienceToNextLevel, setExperienceToNextLevel,
  score, setScore,
  time, setTime,
  stage, setStage,
  stageMessage, setStageMessage,
  showStageMessage, setShowStageMessage,
  playerStats, setPlayerStats,
  upgrades, onLevelUp,
  camera, setCamera
}) => {
  // Canvas reference
  const canvasRef = useRef(null);
  
  // Animation frame reference
  const animationFrameRef = useRef(null);
  
  // Stage message timer reference
  const stageMessageTimerRef = useRef(null);
  
  // Game data reference
  const gameDataRef = useRef({
    player: playerInit(),
    enemies: [],
    experienceGems: [],
    keysPressed: {},
    animation: {
      playerWalk: 0,
      bgOffset: { x: 0, y: 0 },
      effectFrames: [],
      damageTexts: []
    },
    camera: camera // Include camera in game data
  });
  
  // Update game data ref when camera changes
  useEffect(() => {
    gameDataRef.current.camera = camera;
  }, [camera]);
  
  // Set up key listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip if we're typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      // Handle pause
      if (e.key === 'Escape' && gameState === 'playing') {
        setGameState('paused');
        return;
      }
      
      // Handle camera zoom with +/- keys
      if (gameState === 'playing') {
        if (e.key === '=' || e.key === '+') {
          // Zoom in
          setCamera(prev => ({
            ...prev,
            targetZoom: Math.min(prev.maxZoom, prev.targetZoom + 0.1)
          }));
          return;
        } else if (e.key === '-' || e.key === '_') {
          // Zoom out
          setCamera(prev => ({
            ...prev,
            targetZoom: Math.max(prev.minZoom, prev.targetZoom - 0.1)
          }));
          return;
        } else if (e.key === '0') {
          // Reset zoom
          setCamera(prev => ({
            ...prev,
            targetZoom: 0.65 // Default Vampire Survivors zoom
          }));
          return;
        }
      }
      
      // Regular movement keys
      gameDataRef.current.keysPressed[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      gameDataRef.current.keysPressed[e.key.toLowerCase()] = false;
    };
    
    // Handle mouse wheel for zoom
    const handleWheel = (e) => {
      if (gameState === 'playing') {
        e.preventDefault();
        
        // Calculate new zoom based on wheel direction
        const zoomChange = e.deltaY > 0 ? -0.05 : 0.05;
        setCamera(prev => ({
          ...prev,
          targetZoom: Math.max(
            prev.minZoom,
            Math.min(
              prev.maxZoom,
              prev.targetZoom + zoomChange
            )
          )
        }));
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Add wheel event to canvas
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel);
    }
    
    // Initialize the game engine
    if (canvas && gameState === 'playing') {
      // Set canvas size
      canvas.width = Math.min(800, window.innerWidth - 40);
      canvas.height = Math.min(600, window.innerHeight - 120);
      
      // Initialize engine
      initGameEngine(canvas, gameDataRef.current);
    }

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      if (canvas) {
        canvas.removeEventListener('wheel', handleWheel);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (stageMessageTimerRef.current) {
        clearTimeout(stageMessageTimerRef.current);
      }
    };
  }, [gameState, setGameState, setCamera]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }
    
    let lastTime = 0;

    const gameLoop = (timestamp) => {
      // Calculate delta time
      const deltaTime = lastTime ? timestamp - lastTime : 0;
      lastTime = timestamp;

      // Get canvas reference
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Update camera zoom with smooth transition
      if (camera.zoom !== camera.targetZoom) {
        const zoomDiff = camera.targetZoom - camera.zoom;
        setCamera(prev => ({
          ...prev,
          zoom: prev.zoom + zoomDiff * prev.zoomSpeed
        }));
        
        // Snap to target if very close
        if (Math.abs(zoomDiff) < 0.001) {
          setCamera(prev => ({
            ...prev,
            zoom: prev.targetZoom
          }));
        }
      }

      // Update game state
      updateGame(deltaTime, timestamp, gameDataRef.current, {
        playerStats,
        level,
        stage,
        stageMessage,
        showStageMessage,
        time,
        score,
        upgrades,
        setPlayerStats,
        setStage,
        setStageMessage,
        setShowStageMessage,
        stageMessageTimerRef,
        setTime: (t) => setTime(typeof t === 'function' ? t(time) : t),
        setScore: (s) => setScore(typeof s === 'function' ? s(score) : s),
        setExperience: (exp) => {
          const newExp = typeof exp === 'function' ? exp(experience) : exp;
          
          if (newExp >= experienceToNextLevel) {
            // Level up
            setLevel(level + 1);
            setExperience(newExp - experienceToNextLevel);
            setExperienceToNextLevel(Math.floor(experienceToNextLevel * 1.2));
            onLevelUp();
          } else {
            setExperience(newExp);
          }
        },
        setGameState
      });

      // Render the game
      renderGame(canvas, gameDataRef.current, {
        playerStats,
        level,
        experience,
        experienceToNextLevel,
        score,
        time,
        stage,
        stageMessage,
        showStageMessage,
        upgrades
      });

      // Continue the loop
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    gameState, playerStats, level, stage, stageMessage,
    showStageMessage, time, score, experience, experienceToNextLevel,
    upgrades, setGameState, setPlayerStats, setStage, setStageMessage,
    setShowStageMessage, setTime, setScore, setExperience, setLevel,
    onLevelUp, camera // Add camera to dependencies
  ]);

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className="bg-gray-800 rounded-lg shadow-lg" 
        style={{ touchAction: 'none' }} // Prevents default touch actions for better mobile experience
      />
      
      {/* Optional zoom controls for mobile */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button 
          className="bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center"
          onClick={() => setCamera(prev => ({
            ...prev,
            targetZoom: Math.min(prev.maxZoom, prev.targetZoom + 0.1)
          }))}
        >
          +
        </button>
        <button 
          className="bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center"
          onClick={() => setCamera(prev => ({
            ...prev,
            targetZoom: Math.max(prev.minZoom, prev.targetZoom - 0.1)
          }))}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default GameCanvas;