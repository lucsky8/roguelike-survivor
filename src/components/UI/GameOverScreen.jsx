import React, { useEffect, useRef } from 'react';

const GameOverScreen = ({ score, time, stage, level, onPlayAgain }) => {
  const overlayRef = useRef(null);
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);

  // Add blood splatter effect animation
  useEffect(() => {
    if (!overlayRef.current) return;
    
    const overlay = overlayRef.current;
    
    // Create blood splatter particles
    const particleCount = 35;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 80 + 20;
      particle.className = 'absolute rounded-full z-20';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = `rgba(${180 + Math.random() * 75}, ${0 + Math.random() * 20}, ${0 + Math.random() * 20}, ${0.4 + Math.random() * 0.6})`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.transform = `scale(0)`;
      particle.style.opacity = '0';
      particle.style.transition = `transform ${0.5 + Math.random() * 1}s ease-out, opacity ${0.5 + Math.random() * 1}s ease-out`;
      overlay.appendChild(particle);
      particles.push(particle);
    }
    
    // Animate particles
    setTimeout(() => {
      particles.forEach(particle => {
        particle.style.transform = 'scale(1)';
        particle.style.opacity = '1';
      });
    }, 100);
    
    return () => {
      particles.forEach(particle => {
        if (overlay.contains(particle)) {
          overlay.removeChild(particle);
        }
      });
    };
  }, []);

  // Add CSS animations to document head to avoid jsx attribute issues
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes pulse {
        0% { opacity: 0.7; }
        100% { opacity: 1; }
      }
      
      @keyframes buttonGlow {
        0% { box-shadow: 0 0 15px rgba(255, 0, 0, 0.7), 0 0 30px rgba(255, 0, 0, 0.4); }
        100% { box-shadow: 0 0 25px rgba(255, 0, 0, 0.9), 0 0 50px rgba(255, 0, 0, 0.6); }
      }
      
      @keyframes borderPulse {
        0% { opacity: 0.7; width: 90%; }
        100% { opacity: 1; width: 100%; }
      }
      
      .red-vignette {
        box-shadow: inset 0 0 150px rgba(255, 0, 0, 0.9);
        animation: pulse 2s infinite alternate;
      }
      
      .game-over-button {
        animation: buttonGlow 1.5s infinite alternate;
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.7), 0 0 40px rgba(255, 0, 0, 0.4);
      }
      
      .game-over-line {
        box-shadow: 0 0 15px #ff0000;
        animation: borderPulse 1s infinite alternate;
      }
    `;
    
    // Add the style element to the head
    document.head.appendChild(styleElement);
    
    // Clean up on component unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div ref={overlayRef} className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 rounded-lg overflow-hidden">
      {/* Red border around the entire screen */}
      <div className="absolute inset-0 border-4 border-red-700 z-20"></div>
      
      {/* Strong pulsing red vignette overlay */}
      <div className="absolute inset-0 pointer-events-none red-vignette" />
      
      {/* Game Over text with EXTREME visibility */}
      <div className="relative mb-10 z-30 text-center">
        {/* Shadow layer for depth */}
        <h2 className="absolute text-8xl font-bold text-black pixel-font" 
            style={{ 
              left: '5px', 
              top: '5px', 
              opacity: 0.7
            }}>
          GAME OVER
        </h2>
        
        {/* Main GAME OVER text */}
        <h2 className="text-8xl font-bold text-red-600 pixel-font relative"
            style={{ 
              textShadow: '0 0 20px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000',
              letterSpacing: '4px'
            }}>
          GAME OVER
        </h2>
        
        {/* Animated red line under game over */}
        <div className="h-2 bg-red-600 mt-2 animate-pulse game-over-line"></div>
      </div>
      
      {/* Stats with stronger glow effect */}
      <div className="bg-black bg-opacity-80 p-8 rounded-lg border-2 border-red-700 shadow-2xl mb-8 z-30 w-1/2 min-w-[300px]"
           style={{ boxShadow: '0 0 30px rgba(255, 0, 0, 0.4)' }}>
        <p className="text-3xl mb-4 text-gray-100">Score: <span className="text-yellow-300 font-bold" 
           style={{ textShadow: '0 0 10px #ffcc00' }}>{score}</span></p>
        <p className="text-3xl mb-8 text-gray-100">
          Time Survived: <span className="text-yellow-300 font-bold"
            style={{ textShadow: '0 0 10px #ffcc00' }}>{minutes}:{seconds.toString().padStart(2, '0')}</span>
        </p>
        <p className="text-2xl mb-4 text-gray-100">Stage Reached: <span className="text-yellow-300 font-bold"
           style={{ textShadow: '0 0 10px #ffcc00' }}>{stage}</span></p>
        <p className="text-2xl mb-2 text-gray-100">Level: <span className="text-yellow-300 font-bold"
           style={{ textShadow: '0 0 10px #ffcc00' }}>{level}</span></p>
      </div>
      
      {/* More prominent play again button */}
      <button
        onClick={onPlayAgain}
        className="bg-red-700 hover:bg-red-600 text-white font-bold py-5 px-12 rounded-lg text-2xl transform transition-transform duration-200 hover:scale-110 shadow-2xl mb-4 z-30 game-over-button"
      >
        PLAY AGAIN
      </button>
    </div>
  );
};

export default GameOverScreen;