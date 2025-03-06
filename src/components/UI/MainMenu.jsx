import React, { useEffect, useRef, useState } from 'react';
import './MainMenu.css';
import GameControls from './GameControls';

const MainMenu = ({ onStartGame }) => {
  const [showControls, setShowControls] = useState(false);
  const menuRef = useRef(null);
  const floatingElementsRef = useRef([]);

  useEffect(() => {
    if (!menuRef.current) return;

    const container = menuRef.current;
    const elements = [];
    
    // Floating magical items (gems, wands, axes, fire)
    const items = [
      { type: 'gem', color: '#00FFFF', size: 20 },
      { type: 'gem', color: '#FF00FF', size: 15 },
      { type: 'gem', color: '#FFFF00', size: 18 },
      { type: 'wand', color: '#C0C0C0', size: 25 },
      { type: 'axe', color: '#FF6347', size: 22 },
      { type: 'fire', color: '#FF4500', size: 18 }
    ];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const element = document.createElement('div');

      element.className = 'floating-item';
      element.style.width = `${item.size}px`;
      element.style.height = `${item.size}px`;
      element.style.top = `${Math.random() * 80}%`;
      element.style.left = `${Math.random() * 80}%`;

      // Assign different styles for each item type
      if (item.type === 'gem') {
        element.style.backgroundColor = item.color;
        element.style.borderRadius = '4px';
        element.style.transform = 'rotate(45deg)';
        element.style.boxShadow = `0 0 15px ${item.color}`;
      } else if (item.type === 'wand') {
        element.style.backgroundColor = item.color;
        element.style.borderRadius = '2px';
        element.style.width = '4px';
        element.style.height = '25px';
        element.style.boxShadow = `0 0 10px ${item.color}`;
      } else if (item.type === 'axe') {
        element.style.backgroundColor = item.color;
        element.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
        element.style.boxShadow = `0 0 10px ${item.color}`;
      } else if (item.type === 'fire') {
        element.style.backgroundColor = 'transparent';
        element.style.borderRadius = '50%';
        element.style.boxShadow = `0 0 20px ${item.color}`;
      }

      element.style.animation = `float ${3 + Math.random() * 4}s infinite alternate ease-in-out, 
                                 spin ${5 + Math.random() * 10}s infinite linear`;

      container.appendChild(element);
      elements.push(element);
    }

    floatingElementsRef.current = elements;

    return () => {
      elements.forEach(el => {
        if (container.contains(el)) {
          container.removeChild(el);
        }
      });
    };
  }, []);

  return (
    <div ref={menuRef} className="main-menu">
      {/* Animated border glow effect */}
      <div className="menu-border" />

      <div className="menu-content">
        <h1 className="game-title">Roguelike Survivor new</h1>
        <p className="menu-subtitle">Survive against endless waves of enemies!</p>

        {/* Play button */}
        <button onClick={onStartGame} className="menu-button">
          <span className="button-text">PLAY</span>
        </button>

        {/* Controls button */}
        <button onClick={() => setShowControls(true)} className="controls-button">
          <span className="button-text">CONTROLS</span>
        </button>
      </div>

      {/* Controls modal */}
      {showControls && (
        <GameControls onClose={() => setShowControls(false)} isModal={true} />
      )}
      
      <style jsx>{`
        /* Main menu styling */
        .main-menu {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(10, 10, 10, 0.9);
          overflow: hidden;
        }

        /* Glowing animated border */
        .menu-border {
          position: absolute;
          inset: 10px;
          border: 2px solid #8000ff;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(128, 0, 255, 0.7);
          animation: pulse-border 3s infinite alternate;
        }

        /* Menu text */
        .menu-content {
          position: relative;
          z-index: 10;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .game-title {
          font-size: 48px;
          font-weight: bold;
          color: #ffcc00;
          text-shadow: 0 0 10px rgba(255, 204, 0, 0.8);
          margin-bottom: 10px;
        }

        .menu-subtitle {
          font-size: 18px;
          color: #bbb;
          margin-bottom: 30px;
        }

        /* Buttons */
        .menu-button, .controls-button {
          background: linear-gradient(90deg, #512da8, #673ab7);
          padding: 12px 30px;
          width: 200px;
          border: none;
          border-radius: 8px;
          font-size: 20px;
          font-weight: bold;
          color: white;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(103, 58, 183, 0.8);
          transition: transform 0.2s, box-shadow 0.2s;
          margin-bottom: 15px;
        }

        .menu-button {
          background: linear-gradient(90deg, #512da8, #673ab7);
        }

        .controls-button {
          background: linear-gradient(90deg, #1a237e, #3949ab);
        }

        .menu-button:hover, .controls-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(103, 58, 183, 1);
        }

        /* Floating elements */
        .floating-item {
          position: absolute;
          opacity: 0.8;
          transition: transform 0.5s ease-out, opacity 0.5s ease-out;
        }

        /* Keyframe animations */
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-20px); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse-border {
          0% { opacity: 0.3; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default MainMenu;