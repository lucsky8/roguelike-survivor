import React from 'react';
import '../../App.css'; // Ensure correct path

const UpgradeMenu = ({ options, onSelect }) => {
  return (
    <div className="upgrade-menu">
      <h2 className="upgrade-title">Level Up!</h2>
      <p className="upgrade-subtitle">Choose an upgrade:</p>
      <div className="upgrade-options">
  {options.map((upgrade, index) => (
    <button 
      key={index} 
      onClick={() => onSelect(upgrade)} 
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
    </div>
  );
};

export default UpgradeMenu;