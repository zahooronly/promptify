import React, { useState } from 'react';

export const HelpTooltip: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const shortcuts = [
    { key: 'Ctrl + Enter', description: 'Enhance prompt' },
    { key: 'Escape', description: 'Clear errors' },
    { key: 'I', description: 'Focus input field' },
    { key: 'O', description: 'Focus output area' },
    { key: 'C', description: 'Clear all data' },
    { key: 'Ctrl + A', description: 'Select all text (in output)' },
    { key: 'Double-click', description: 'Select all text (in output)' }
  ];

  return (
    <div className="help-tooltip">
      <button
        className="help-button"
        onClick={() => setIsVisible(!isVisible)}
        title="Keyboard shortcuts"
        aria-label="Show keyboard shortcuts"
      >
        ?
      </button>
      
      {isVisible && (
        <div className="help-content">
          <div className="help-header">
            <h3>Keyboard Shortcuts</h3>
            <button
              className="help-close"
              onClick={() => setIsVisible(false)}
              aria-label="Close help"
            >
              ✕
            </button>
          </div>
          
          <div className="shortcuts-list">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="shortcut-item">
                <kbd className="shortcut-key">{shortcut.key}</kbd>
                <span className="shortcut-description">{shortcut.description}</span>
              </div>
            ))}
          </div>
          
          <div className="help-footer">
            <small>Tip: Use Tab to navigate between elements</small>
          </div>
        </div>
      )}
      
      {isVisible && (
        <div 
          className="help-overlay"
          onClick={() => setIsVisible(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};