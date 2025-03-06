import React from 'react';
import { allUpgrades } from '../../game/config'; // Import your upgrades configuration


  const PauseMenu = ({ onResume, onQuit, playerStats, playerWeapons = [], upgrades = [] }) => {

  // Group upgrades by type (weapons and passive)
  const weaponUpgrades = upgrades.filter(id => {
    const upgrade = allUpgrades.find(u => u.id === id);
    return upgrade && upgrade.type === 'weapon';
  });
  
  const passiveUpgrades = upgrades.filter(id => {
    const upgrade = allUpgrades.find(u => u.id === id);
    return upgrade && upgrade.type === 'passive';
  });
  
  // Helper function to get upgrade details
  const getUpgradeDetails = (upgradeId) => {
    // First try to find the exact upgrade
    const exactMatch = allUpgrades.find(u => u.id === upgradeId);
    if (exactMatch) return exactMatch;
    
    // If not found, it might be a base weapon without level indicator
    // Extract the base name (e.g., "wand" from "wand2")
    const baseName = upgradeId.replace(/\d+$/, '');
    const baseUpgrade = allUpgrades.find(u => u.id === baseName);
    
    return baseUpgrade || { 
      name: `${upgradeId.charAt(0).toUpperCase() + upgradeId.slice(1)}`,
      description: 'A powerful weapon',
      color: '#999999',
      icon: '⚔️'
    };
  };
  
  return (
    <div className="pause-menu">
      <div className="pause-overlay"></div>
      <div className="pause-content">
        <h2>Game Paused</h2>
        
        {/* Player Stats Section */}
        <div className="stats-section">
          <h3>Player Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Health:</span>
              <span className="stat-value">{Math.ceil(playerStats.health)} / {playerStats.maxHealth}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Damage:</span>
              <span className="stat-value">{(playerStats.damage).toFixed(1)}x</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Speed:</span>
              <span className="stat-value">{(playerStats.speed).toFixed(1)}x</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Area:</span>
              <span className="stat-value">{(playerStats.area).toFixed(1)}x</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Cooldown:</span>
              <span className="stat-value">{(playerStats.cooldown).toFixed(2)}x</span>
            </div>
            {playerStats.critChance > 0 && (
              <div className="stat-item">
                <span className="stat-label">Crit Chance:</span>
                <span className="stat-value">{playerStats.critChance}%</span>
              </div>
            )}
            {playerStats.critDamage > 0 && (
              <div className="stat-item">
                <span className="stat-label">Crit Damage:</span>
                <span className="stat-value">{playerStats.critDamage}%</span>
              </div>
            )}
            {playerStats.armor > 0 && (
              <div className="stat-item">
                <span className="stat-label">Damage Reduction:</span>
                <span className="stat-value">{playerStats.armor}%</span>
              </div>
            )}
            {playerStats.reviveCount > 0 && (
              <div className="stat-item">
                <span className="stat-label">Revives:</span>
                <span className="stat-value">{playerStats.reviveCount}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Upgrades Section */}
        <div className="upgrades-section">
          <h3>Current Upgrades</h3>
          
          {/* Weapons Section */}
          <div className="upgrade-category">
            <h4>Weapons</h4>
            <div className="upgrade-list">
              {playerWeapons.map((weapon, index) => {
                // Find the corresponding upgrade
                const baseId = weapon.type;
                const upgradeId = weapon.level > 1 ? `${baseId}${weapon.level}` : baseId;
                const details = getUpgradeDetails(upgradeId);
                
                return (
                  <div className="upgrade-item" key={`weapon-${index}`}>
                    <div 
                      className="upgrade-icon" 
                      style={{ backgroundColor: details.color || '#666' }}
                    >
                      {details.icon || '⚔️'}
                    </div>
                    <div className="upgrade-details">
                      <div className="upgrade-name">{details.name || `${weapon.type.charAt(0).toUpperCase() + weapon.type.slice(1)} Lvl ${weapon.level}`}</div>
                      <div className="upgrade-description">{details.description || `Level ${weapon.level} ${weapon.type} weapon`}</div>
                    </div>
                  </div>
                );
              })}
              {playerWeapons.length === 0 && (
                <div className="no-upgrades">No weapon upgrades yet.</div>
              )}
            </div>
          </div>
          
          {/* Passive Upgrades Section */}
          <div className="upgrade-category">
            <h4>Passive Upgrades</h4>
            <div className="upgrade-list">
              {passiveUpgrades.map((upgradeId, index) => {
                const details = getUpgradeDetails(upgradeId);
                
                return (
                  <div className="upgrade-item" key={`passive-${index}`}>
                    <div 
                      className="upgrade-icon" 
                      style={{ backgroundColor: details.color || '#666' }}
                    >
                      {details.icon || '🔮'}
                    </div>
                    <div className="upgrade-details">
                      <div className="upgrade-name">{details.name}</div>
                      <div className="upgrade-description">{details.description}</div>
                    </div>
                  </div>
                );
              })}
              {passiveUpgrades.length === 0 && (
                <div className="no-upgrades">No passive upgrades yet.</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="button-container">
          <button className="resume-button" onClick={onResume}>Resume</button>
          <button className="quit-button" onClick={onQuit}>Quit</button>
        </div>
      </div>
      
      <style jsx>{`
        .pause-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .pause-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
        }
        
        .pause-content {
          position: relative;
          background-color: #222;
          border: 2px solid #555;
          border-radius: 10px;
          padding: 30px;
          max-width: 800px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          color: #fff;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        
        h2 {
          text-align: center;
          color: #f8f8f8;
          margin-top: 0;
          font-size: 28px;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
        
        h3 {
          color: #f8f8f8;
          border-bottom: 1px solid #444;
          padding-bottom: 8px;
          margin-top: 20px;
          font-size: 22px;
        }
        
        h4 {
          color: #ccc;
          margin: 15px 0 10px 0;
          font-size: 18px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .stat-item {
          background-color: #333;
          padding: 10px;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
        }
        
        .stat-label {
          font-weight: bold;
          color: #aaa;
        }
        
        .stat-value {
          color: #61dafb;
        }
        
        .upgrade-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .upgrade-item {
          background-color: #333;
          border-radius: 5px;
          padding: 10px;
          display: flex;
          align-items: center;
        }
        
        .upgrade-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          margin-right: 15px;
          flex-shrink: 0;
        }
        
        .upgrade-details {
          flex-grow: 1;
        }
        
        .upgrade-name {
          font-weight: bold;
          color: #f8f8f8;
          margin-bottom: 4px;
        }
        
        .upgrade-description {
          font-size: 0.9em;
          color: #aaa;
        }
        
        .no-upgrades {
          color: #888;
          font-style: italic;
          padding: 10px;
        }
        
        .button-container {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 30px;
        }
        
        button {
          padding: 12px 30px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .resume-button {
          background-color: #2c974b;
          color: white;
        }
        
        .resume-button:hover {
          background-color: #38b35a;
          transform: translateY(-2px);
        }
        
        .quit-button {
          background-color: #e74c3c;
          color: white;
        }
        
        .quit-button:hover {
          background-color: #f55a4a;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default PauseMenu;