import { type AppError, AppErrorClass, ErrorType } from '../types';

export const getErrorMessage = (error: AppError): string => {
    switch (error.type) {
        case ErrorType.API_KEY_MISSING:
            return 'API key is missing. Please configure your GEMMA_API_KEY.';
        case ErrorType.AUTHENTICATION_ERROR:
            return 'Authentication failed. Please check your API key.';
        case ErrorType.NETWORK_ERROR:
            return 'Network error. Please check your internet connection and try again.';
        case ErrorType.RATE_LIMIT_ERROR:
            return 'Too many requests. Please wait a moment and try again.';
        case ErrorType.INVALID_INPUT:
            return error.message;
        default:
            return 'An unexpected error occurred. Please try again.';
    }
};

export const getDetailedErrorMessage = (error: AppError): string => {
    const baseMessage = getErrorMessage(error);

    switch (error.type) {
        case ErrorType.API_KEY_MISSING:
            return `${baseMessage} Add VITE_GEMMA_API_KEY to your .env file.`;
        case ErrorType.AUTHENTICATION_ERROR:
            return `${baseMessage} Ensure your API key is valid and has the necessary permissions.`;
        case ErrorType.NETWORK_ERROR:
            return `${baseMessage} This could be due to connectivity issues or server problems.`;
        case ErrorType.RATE_LIMIT_ERROR:
            return `${baseMessage} You can try again in a few minutes.`;
        case ErrorType.INVALID_INPUT:
            return `${baseMessage} Check that your prompt is between 10-4000 characters.`;
        default:
            return `${baseMessage} If this persists, try reloading the extension.`;
    }
};

export const isRetryableError = (error: AppError): boolean => {
    return error.retryable;
};

export const getRetryDelay = (error: AppError, attemptCount: number = 1): number => {
    switch (error.type) {
        case ErrorType.RATE_LIMIT_ERROR:
            return Math.min(1000 * Math.pow(2, attemptCount), 30000); // Exponential backoff, max 30s
        case ErrorType.NETWORK_ERROR:
            return Math.min(1000 * attemptCount, 10000); // Linear backoff, max 10s
        default:
            return 1000; // 1 second default
    }
};

export const shouldAutoRetry = (error: AppError, attemptCount: number): boolean => {
    if (!isRetryableError(error) || attemptCount >= 3) {
        return false;
    }

    switch (error.type) {
        case ErrorType.NETWORK_ERROR:
            return attemptCount < 2; // Only auto-retry once for network errors
        case ErrorType.RATE_LIMIT_ERROR:
            return false; // Never auto-retry rate limits
        default:
            return false;
    }
};

export const createAppError = (
    type: ErrorType,
    message: string,
    details?: string,
    retryable: boolean = false
): AppErrorClass => {
    return new AppErrorClass(type, message, details, retryable);
};

export const logError = (error: AppError, context?: string): void => {
    const logData = {
        type: error.type,
        message: error.message,
        details: error.details,
        retryable: error.retryable,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };

    console.error('Application Error:', logData);

    // In production, you might want to send this to an error tracking service
    if (import.meta.env.PROD) {
        // Example: sendToErrorTracking(logData);
    }
};

export const formatErrorForUser = (error: AppError): {
    title: string;
    message: string;
    action?: string;
} => {
    switch (error.type) {
        case ErrorType.API_KEY_MISSING:
            return {
                title: 'Configuration Required',
                message: 'Your API key needs to be configured.',
                action: 'Add your GEMMA_API_KEY to the .env file'
            };
        case ErrorType.AUTHENTICATION_ERROR:
            return {
                title: 'Authentication Failed',
                message: 'There\'s an issue with your API key.',
                action: 'Check that your API key is valid'
            };
        case ErrorType.NETWORK_ERROR:
            return {
                title: 'Connection Problem',
                message: 'Unable to connect to the AI service.',
                action: 'Check your internet connection'
            };
        case ErrorType.RATE_LIMIT_ERROR:
            return {
                title: 'Rate Limit Reached',
                message: 'You\'ve made too many requests.',
                action: 'Please wait a moment before trying again'
            };
        case ErrorType.INVALID_INPUT:
            return {
                title: 'Invalid Input',
                message: error.message,
                action: 'Please correct your prompt and try again'
            };
        default:
            return {
                title: 'Unexpected Error',
                message: 'Something went wrong.',
                action: 'Try again or reload the extension'
            };
    }
};