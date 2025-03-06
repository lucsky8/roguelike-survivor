import React from 'react';

const UpgradeMenu = ({ options, onSelect }) => {
  const handleTouchStart = (e, upgrade) => {
    // Prevent default touch behavior
    e.preventDefault();
    
    if (onSelect) {
      onSelect(upgrade);
    }
  };

  return (
    <div className="upgrade-menu">
      <h2 className="upgrade-title">Level Up!</h2>
      <p className="upgrade-subtitle">Choose an upgrade:</p>
      <div className="upgrade-options">
        {options.map((upgrade, index) => (
          <button 
            key={index} 
            onClick={() => onSelect(upgrade)}
            onTouchStart={(e) => handleTouchStart(e, upgrade)}
            className="upgrade-button"
            style={{ borderColor: upgrade.color || '#ffffff' }}
          >
            <div className="upgrade-name">
              <span className="upgrade-icon">{upgrade.icon || '⚡'}</span>
              {upgrade.name}
            </div>
            <div className="upgrade-description">{upgrade.description}</div>
            <div className="upgrade-rarity" style={{ color: upgrade.color || '#ffffff' }}>
              {upgrade.rarity || 'common'}
            </div>
          </button>
        ))}
      </div>
      
      {/* Improved mobile styles */}
      <style jsx>{`
        .upgrade-menu {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(10, 10, 10, 0.9);
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 90%;
          max-width: 500px;
          animation: fadeIn 0.3s ease-in-out;
          z-index: 1000;
        }
        
        .upgrade-title {
          font-size: 24px;
          font-weight: bold;
          color: #ffcc00;
          text-shadow: 0 0 10px rgba(255, 204, 0, 0.8);
          margin-bottom: 5px;
        }
        
        .upgrade-subtitle {
          font-size: 16px;
          color: #bbb;
          margin-bottom: 20px;
        }
        
        .upgrade-options {
          display: flex;
          flex-direction: column;
          gap: 15px;
          width: 100%;
        }
        
        .upgrade-button {
          background: rgba(30, 30, 40, 0.8);
          border: 2px solid;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
          font-size: 16px;
          text-align: left;
        }
        
        @media (min-width: 768px) {
          .upgrade-options {
            gap: 12px;
          }
          
          .upgrade-button {
            padding: 12px;
          }
        }
        
        .upgrade-button:hover, .upgrade-button:active {
          transform: scale(1.03);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
        }
        
        .upgrade-name {
          display: flex;
          align-items: center;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #ffeb3b;
        }
        
        .upgrade-icon {
          margin-right: 8px;
          font-size: 20px;
        }
        
        .upgrade-description {
          font-size: 14px;
          color: #ddd;
          margin-bottom: 6px;
        }
        
        .upgrade-rarity {
          text-align: right;
          font-style: italic;
          font-size: 12px;
          margin-top: 5px;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -60%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </div>
  );
};

export default UpgradeMenu;