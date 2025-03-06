import React from 'react';

const MobilePauseButton = ({ onPause }) => {
  const handleTouchStart = (e) => {
    e.preventDefault();
    if (onPause) onPause();
  };
  
  return (
    <button 
      className="mobile-pause-button"
      onTouchStart={handleTouchStart}
    >
      <div className="pause-icon">
        <div className="pause-bar"></div>
        <div className="pause-bar"></div>
      </div>
      
      <style jsx>{`
        .mobile-pause-button {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 900;
          touch-action: none;
        }
        
        .pause-icon {
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: space-between;
        }
        
        .pause-bar {
          width: 7px;
          height: 100%;
          background-color: white;
          border-radius: 2px;
        }
        
        @media (min-width: 768px) {
          .mobile-pause-button {
            display: none; /* Hide on desktop/larger screens */
          }
        }
      `}</style>
    </button>
  );
};

export default MobilePauseButton;