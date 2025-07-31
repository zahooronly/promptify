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

  const severityClasses = {
    error: 'bg-red-50/80 border-red-500 text-red-800',
    warning: 'bg-amber-50/80 border-amber-500 text-amber-800',
    info: 'bg-blue-50/80 border-blue-500 text-blue-800'
  };

  return (
    <div 
      className={`p-3 border-l-4 rounded-lg backdrop-blur-sm flex items-start gap-3 animate-[slideIn_0.3s_ease-out] ${severityClasses[severity]}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-1 flex items-start gap-2">
        <span className="text-base flex-shrink-0 mt-0.5" aria-hidden="true">
          {getErrorIcon(errorType)}
        </span>
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-sm font-medium leading-tight">{message}</span>
          {helpText && (
            <span className="text-xs opacity-80 leading-tight">{helpText}</span>
          )}
          {details && (
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer font-medium mb-1">Technical Details</summary>
              <pre className="bg-black/5 p-2 rounded text-xs overflow-x-auto m-0 whitespace-pre-wrap">
                {details}
              </pre>
            </details>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 flex-shrink-0">
        {onRetry && (
          <button 
            className="px-2 py-1 bg-blue-500/10 text-blue-600 border-none rounded text-xs cursor-pointer transition-all duration-200 hover:bg-blue-500/20"
            onClick={onRetry}
            title="Retry the operation"
          >
            🔄 Try Again
          </button>
        )}
        {onDismiss && (
          <button 
            className="w-6 h-6 bg-black/5 text-slate-500 border-none rounded text-xs cursor-pointer transition-all duration-200 hover:bg-black/10 flex items-center justify-center"
            onClick={onDismiss}
            title="Dismiss this error"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        )}
      </div>

      {autoHide && countdown > 0 && (
        <div className="text-xs opacity-70 text-center mt-1 absolute bottom-1 left-1/2 transform -translate-x-1/2">
          Auto-dismiss in {countdown}s
        </div>
      )}
    </div>
  );
};