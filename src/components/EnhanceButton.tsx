import React from 'react';
import type { EnhanceButtonProps } from '../types';

export const EnhanceButton: React.FC<EnhanceButtonProps> = ({
  onClick,
  disabled,
  isLoading
}) => {
  return (
    <button
      className={`enhance-button ${isLoading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {isLoading ? (
        <>
          <span className="loading-spinner"></span>
          Enhancing...
        </>
      ) : (
        'Enhance'
      )}
    </button>
  );
};