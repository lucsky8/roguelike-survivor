import React, { useState, useEffect, useRef, useCallback } from 'react';

const TouchControls = ({ onDirectionChange, onZoomIn, onZoomOut }) => {
  const joystickRef = useRef(null);
  const joystickKnobRef = useRef(null);
  const [touching, setTouching] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [currentDirection, setCurrentDirection] = useState(null);
  
  // Track if controls are visible (auto-hide when not in use)
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideControlsTimerRef = useRef(null);
  
  // Define processJoystickPosition with useCallback to avoid recreation
  const processJoystickPosition = useCallback((touchX, touchY, centerX, centerY, radius) => {
    // Calculate distance from center
    const deltaX = touchX - centerX;
    const deltaY = touchY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Normalize to keep within joystick bounds
    let normalizedX = deltaX;
    let normalizedY = deltaY;
    
    if (distance > radius) {
      normalizedX = (deltaX / distance) * radius;
      normalizedY = (deltaY / distance) * radius;
    }
    
    // Update joystick position
    setJoystickPosition({
      x: normalizedX,
      y: normalizedY
    });
    
    // Determine direction
    const angle = Math.atan2(normalizedY, normalizedX);
    const angleDegrees = (angle * 180) / Math.PI;
    
    // Only send direction when it changes
    let newDirection = null;
    
    // Simple 4-way direction
    if (distance > radius * 0.3) { // Add a small deadzone
      if (angleDegrees > -45 && angleDegrees <= 45) {
        newDirection = 'right';
      } else if (angleDegrees > 45 && angleDegrees <= 135) {
        newDirection = 'down';
      } else if (angleDegrees > 135 || angleDegrees <= -135) {
        newDirection = 'left';
      } else {
        newDirection = 'up';
      }
    }
    
    // Only update if direction changed
    if (newDirection !== currentDirection) {
      setCurrentDirection(newDirection);
      
      if (onDirectionChange) {
        onDirectionChange(newDirection);
      }
    }
  }, [currentDirection, onDirectionChange]);
  
  // Reset hide timer whenever the user touches the screen
  const resetHideTimer = useCallback(() => {
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    
    setControlsVisible(true);
    
    hideControlsTimerRef.current = setTimeout(() => {
      if (!touching) {
        setControlsVisible(false);
      }
    }, 3000); // Hide after 3 seconds of inactivity
  }, [touching]);
  
  // Set up joystick touch handlers
  useEffect(() => {
    const joystick = joystickRef.current;
    const joystickKnob = joystickKnobRef.current;
    
    if (!joystick || !joystickKnob) return;
    
    // Get joystick position and dimensions
    const joystickRect = joystick.getBoundingClientRect();
    const joystickCenterX = joystickRect.width / 2;
    const joystickCenterY = joystickRect.height / 2;
    const joystickRadius = joystickRect.width / 2;
    
    // Handle touch start
    const handleTouchStart = (e) => {
      e.preventDefault();
      setTouching(true);
      resetHideTimer();
      
      // Process touch position
      const touch = e.touches[0];
      processJoystickPosition(touch.clientX - joystickRect.left, touch.clientY - joystickRect.top, joystickCenterX, joystickCenterY, joystickRadius);
    };
    
    // Handle touch move
    const handleTouchMove = (e) => {
      if (!touching) return;
      e.preventDefault();
      
      // Process touch position
      const touch = e.touches[0];
      processJoystickPosition(touch.clientX - joystickRect.left, touch.clientY - joystickRect.top, joystickCenterX, joystickCenterY, joystickRadius);
    };
    
    // Handle touch end
    const handleTouchEnd = (e) => {
      e.preventDefault();
      setTouching(false);
      
      // Reset joystick and direction
      setJoystickPosition({ x: 0, y: 0 });
      setCurrentDirection(null);
      
      // Call direction change callback with null to indicate stop
      if (onDirectionChange) {
        onDirectionChange(null);
      }
      
      // Start timer to hide controls after inactivity
      resetHideTimer();
    };
    
    // Add event listeners to joystick
    joystick.addEventListener('touchstart', handleTouchStart, { passive: false });
    joystick.addEventListener('touchmove', handleTouchMove, { passive: false });
    joystick.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Clean up on unmount
    return () => {
      joystick.removeEventListener('touchstart', handleTouchStart);
      joystick.removeEventListener('touchmove', handleTouchMove);
      joystick.removeEventListener('touchend', handleTouchEnd);
      
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, [touching, processJoystickPosition, resetHideTimer]);
  
  // Handle touch activation for the document
  useEffect(() => {
    const handleDocumentTouch = () => {
      resetHideTimer();
    };
    
    document.addEventListener('touchstart', handleDocumentTouch);
    
    return () => {
      document.removeEventListener('touchstart', handleDocumentTouch);
    };
  }, [resetHideTimer]);
  
  return (
    <div className={`touch-controls ${controlsVisible ? 'visible' : 'hidden'}`}>
      {/* Joystick for movement */}
      <div 
        ref={joystickRef}
        className="joystick"
      >
        <div 
          ref={joystickKnobRef}
          className="joystick-knob"
          style={{
            transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`
          }}
        ></div>
      </div>
      
      {/* Zoom buttons */}
      <div className="zoom-buttons">
        <button 
          className="zoom-button zoom-in"
          onTouchStart={(e) => {
            e.preventDefault();
            if (onZoomIn) onZoomIn();
          }}
        >
          +
        </button>
        <button 
          className="zoom-button zoom-out"
          onTouchStart={(e) => {
            e.preventDefault();
            if (onZoomOut) onZoomOut();
          }}
        >
          -
        </button>
      </div>
      
      <style jsx>{`
        .touch-controls {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 200px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 900;
        }
        
        .touch-controls.visible {
          opacity: 0.8;
        }
        
        .touch-controls.hidden {
          opacity: 0;
        }
        
        .joystick {
          position: relative;
          width: 120px;
          height: 120px;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: auto;
          touch-action: none;
        }
        
        .joystick-knob {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          pointer-events: none;
          transition: transform 0.1s ease;
        }
        
        .zoom-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: auto;
        }
        
        .zoom-button {
          width: 50px;
          height: 50px;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          color: white;
          font-size: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          touch-action: none;
          user-select: none;
        }
        
        .zoom-in {
          background: rgba(0, 100, 0, 0.5);
        }
        
        .zoom-out {
          background: rgba(100, 0, 0, 0.5);
        }
        
         /* We need to change this media query to ensure touch controls show on iPad */
        @media (hover: hover) and (pointer: fine) {
          .touch-controls {
            display: none; /* Hide only on true desktop devices with mouse/pointer */
          }
        }
      `}</style>
    </div>
  );
};

export default TouchControls;