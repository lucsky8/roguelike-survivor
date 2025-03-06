import React, { useState } from 'react';

const GameControls = ({ onClose, isModal = false }) => {
  const [activeTab, setActiveTab] = useState('movement');

  return (
    <div className={`game-controls ${isModal ? 'modal' : ''}`}>
      {isModal && (
        <div className="controls-overlay" onClick={onClose}></div>
      )}
      
      <div className="controls-container">
        {isModal && (
          <button className="close-button" onClick={onClose}>×</button>
        )}
        
        <h2 className="controls-title">Game Controls</h2>
        
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'movement' ? 'active' : ''}`} 
            onClick={() => setActiveTab('movement')}
          >
            Movement
          </button>
          <button 
            className={`tab-button ${activeTab === 'camera' ? 'active' : ''}`}
            onClick={() => setActiveTab('camera')}
          >
            Camera
          </button>
          <button 
            className={`tab-button ${activeTab === 'game' ? 'active' : ''}`}
            onClick={() => setActiveTab('game')}
          >
            Game
          </button>
        </div>
        
        <div className="controls-content">
          {activeTab === 'movement' && (
            <div className="controls-section">
              <div className="control-row">
                <div className="control-key-group">
                  <div className="control-key">W</div>
                </div>
                <div className="control-description">Move Up</div>
              </div>
              
              <div className="control-row">
                <div className="control-key-group">
                  <div className="control-key">A</div>
                  <div className="control-key">S</div>
                  <div className="control-key">D</div>
                </div>
                <div className="control-description">Move Left / Down / Right</div>
              </div>
              
              <div className="control-row">
                <div className="control-key-group">
                  <div className="control-key">↑</div>
                </div>
                <div className="control-description">Move Up</div>
              </div>
              
              <div className="control-row">
                <div className="control-key-group">
                  <div className="control-key">←</div>
                  <div className="control-key">↓</div>
                  <div className="control-key">→</div>
                </div>
                <div className="control-description">Move Left / Down / Right</div>
              </div>
            </div>
          )}
          
          {activeTab === 'camera' && (
            <div className="controls-section">
              <div className="control-row">
                <div className="control-key-group">
                  <div className="control-key">+</div>
                </div>
                <div className="control-description">Zoom In</div>
              </div>
              
              <div className="control-row">
                <div className="control-key-group">
                  <div className="control-key">-</div>
                </div>
                <div className="control-description">Zoom Out</div>
              </div>
              
              <div className="control-row">
                <div className="control-key-group">
                  <div className="control-key">0</div>
                </div>
                <div className="control-description">Reset Zoom</div>
              </div>
              
              <div className="control-row">
                <div className="control-key scroll-wheel">
                  <span className="wheel-icon">⟳</span>
                </div>
                <div className="control-description">Zoom In/Out (Mouse Wheel)</div>
              </div>
            </div>
          )}
          
          {activeTab === 'game' && (
            <div className="controls-section">
              <div className="control-row">
                <div className="control-key-group">
                  <div className="control-key">ESC</div>
                </div>
                <div className="control-description">Pause Game</div>
              </div>
              
              <div className="control-row highlight">
                <div className="control-description special-tip">
                  Collect gems to gain experience and level up!
                </div>
              </div>
              
              <div className="control-row highlight">
                <div className="control-description special-tip">
                  Choose upgrades when leveling up to become stronger.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .game-controls {
          font-family: Arial, sans-serif;
          color: white;
        }
        
        .game-controls.modal {
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
        
        .controls-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
        }
        
        .controls-container {
          position: relative;
          background: rgba(20, 20, 30, 0.95);
          border: 2px solid #8000ff;
          border-radius: 10px;
          padding: 25px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 0 20px rgba(128, 0, 255, 0.5);
          z-index: 10;
        }
        
        .close-button {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          color: #ff5555;
          font-size: 30px;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s, transform 0.2s;
        }
        
        .close-button:hover {
          opacity: 1;
          transform: scale(1.1);
        }
        
        .controls-title {
          text-align: center;
          font-size: 28px;
          margin-top: 0;
          margin-bottom: 20px;
          color: #ffcc00;
          text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
        }
        
        .tabs {
          display: flex;
          justify-content: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 20px;
        }
        
        .tab-button {
          background: none;
          border: none;
          color: #bbb;
          font-size: 16px;
          padding: 8px 15px;
          margin: 0 5px;
          cursor: pointer;
          position: relative;
          transition: color 0.3s;
        }
        
        .tab-button:hover {
          color: white;
        }
        
        .tab-button.active {
          color: #ffcc00;
        }
        
        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #8000ff;
          box-shadow: 0 0 8px #8000ff;
        }
        
        .controls-content {
          min-height: 200px;
        }
        
        .controls-section {
          animation: fadeIn 0.3s ease-out;
        }
        
        .control-row {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .control-key-group {
          display: flex;
          gap: 5px;
          width: 120px;
        }
        
        .control-key {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 5px;
          padding: 8px 12px;
          min-width: 20px;
          text-align: center;
          font-weight: bold;
          box-shadow: 0 0 10px rgba(128, 0, 255, 0.3);
        }
        
        .scroll-wheel {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        
        .wheel-icon {
          font-size: 20px;
        }
        
        .control-description {
          flex: 1;
          padding-left: 15px;
        }
        
        .highlight {
          margin-top: 25px;
        }
        
        .special-tip {
          color: #61dafb;
          border-left: 3px solid #61dafb;
          padding: 10px;
          font-style: italic;
          background: rgba(97, 218, 251, 0.1);
          border-radius: 0 5px 5px 0;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default GameControls;