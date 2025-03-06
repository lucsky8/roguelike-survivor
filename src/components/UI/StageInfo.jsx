import React from 'react';

/**
 * StageInfo component displays game stage information
 * @param {Object} props - Component props
 * @param {string} props.stageName - Current stage name
 * @param {number} props.level - Current level
 * @param {number} props.score - Current score
 * @param {Object} props.player - Player information object
 * @param {Function} props.onInitPlayer - Function to initialize player
 */
const StageInfo = ({ 
  stageName = "Stage 1", 
  level = 1, 
  score = 0, 
  player = {}, 
  onInitPlayer 
}) => {
  // Call onInitPlayer when component mounts if the function exists
  React.useEffect(() => {
    if (typeof onInitPlayer === 'function') {
      onInitPlayer();
    }
  }, [onInitPlayer]);

  return (
    <div className="stage-info">
      <div className="stage-header">
        <h2>{stageName}</h2>
        <div className="level-indicator">Level: {level}</div>
      </div>
      
      <div className="game-stats">
        <div className="stat-item">
          <span className="stat-label">Score:</span>
          <span className="stat-value">{score}</span>
        </div>
        
        {player && player.health !== undefined && (
          <div className="stat-item">
            <span className="stat-label">Health:</span>
            <span className="stat-value">{player.health}</span>
          </div>
        )}
        
        {player && player.lives !== undefined && (
          <div className="stat-item">
            <span className="stat-label">Lives:</span>
            <span className="stat-value">{player.lives}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StageInfo;

// Export a playerInit function that can be imported by other components
export const playerInit = (playerData = {}) => {
  return {
    health: 100,
    lives: 3,
    score: 0,
    position: { x: 0, y: 0 },
    ...playerData
  };
};