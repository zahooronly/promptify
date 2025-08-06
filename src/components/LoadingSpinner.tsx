import React from 'react';
import type { LoadingSpinnerProps } from '../types';

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Processing..."
}) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <span className="loading-message">{message}</span>
    </div>
  );
};