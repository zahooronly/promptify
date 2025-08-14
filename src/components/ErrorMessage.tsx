import React, { useEffect, useState } from 'react';
import type { ErrorMessageProps } from '../types';
import { ErrorType } from '../types';

interface ExtendedErrorMessageProps extends ErrorMessageProps {
  errorType?: ErrorType;
  details?: string;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export const ErrorMessage: React.FC<ExtendedErrorMessageProps> = ({
  message,
  onRetry,
  onDismiss,
  errorType,
  details,
  autoHide = false,
  autoHideDelay = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState(0);

  // Auto-hide functionality
  useEffect(() => {
    if (autoHide && autoHideDelay > 0) {
      setCountdown(Math.ceil(autoHideDelay / 1000));
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsVisible(false);
            onDismiss?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [autoHide, autoHideDelay, onDismiss]);

  const getErrorIcon = (type?: ErrorType): string => {
    switch (type) {
      case ErrorType.NETWORK_ERROR:
        return '🌐';
      case ErrorType.AUTHENTICATION_ERROR:
        return '🔐';
      case ErrorType.RATE_LIMIT_ERROR:
        return '⏱️';
      case ErrorType.INVALID_INPUT:
        return '📝';
      case ErrorType.API_KEY_MISSING:
        return '🔑';
      default:
        return '⚠️';
    }
  };

  const getErrorSeverity = (type?: ErrorType): 'error' | 'warning' | 'info' => {
    switch (type) {
      case ErrorType.AUTHENTICATION_ERROR:
      case ErrorType.API_KEY_MISSING:
        return 'error';
      case ErrorType.RATE_LIMIT_ERROR:
      case ErrorType.NETWORK_ERROR:
        return 'warning';
      case ErrorType.INVALID_INPUT:
        return 'info';
      default:
        return 'error';
    }
  };

  const getHelpText = (type?: ErrorType): string | null => {
    switch (type) {
      case ErrorType.NETWORK_ERROR:
        return 'Check your internet connection and try again.';
      case ErrorType.AUTHENTICATION_ERROR:
        return 'Verify your API key is correct in the environment settings.';
      case ErrorType.RATE_LIMIT_ERROR:
        return 'You\'ve reached the API limit. Please wait a moment before trying again.';
      case ErrorType.API_KEY_MISSING:
        return 'Configure your GEMMA_API_KEY in the environment variables.';
      case ErrorType.INVALID_INPUT:
        return 'Please check your prompt and make sure it meets the requirements.';
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  const severity = getErrorSeverity(errorType);
  const helpText = getHelpText(errorType);

  return (
    <div 
      className={`error-container ${severity}`}
      role="alert"
      aria-live="polite"
    >
      <div className="error-content">
        <span className="error-icon" aria-hidden="true">
          {getErrorIcon(errorType)}
        </span>
        <div className="error-text-container">
          <span className="error-text">{message}</span>
          {helpText && (
            <span className="error-help">{helpText}</span>
          )}
          {details && (
            <details className="error-details">
              <summary>Technical Details</summary>
              <pre>{details}</pre>
            </details>
          )}
        </div>
      </div>
      
      <div className="error-actions">
        {onRetry && (
          <button 
            className="retry-button" 
            onClick={onRetry}
            title="Retry the operation"
          >
            🔄 Try Again
          </button>
        )}
        {onDismiss && (
          <button 
            className="dismiss-button" 
            onClick={onDismiss}
            title="Dismiss this error"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        )}
      </div>

      {autoHide && countdown > 0 && (
        <div className="error-countdown">
          Auto-dismiss in {countdown}s
        </div>
      )}
    </div>
  );
};