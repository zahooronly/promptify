// Application State Types
export interface ApplicationState {
    currentPrompt: string;
    enhancedPrompt: string;
    isProcessing: boolean;
    lastError: string | null;
    requestHistory: PromptEnhancementRequest[];
}

// API Request/Response Types
export interface PromptEnhancementRequest {
    originalPrompt: string;
    timestamp: number;
}

export interface PromptEnhancementResponse {
    enhancedPrompt: string;
    originalPrompt: string;
    processingTime: number;
    success: boolean;
    error?: string;
}

// Component Props Types
export interface PromptInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export interface EnhanceButtonProps {
    onClick: () => void;
    disabled: boolean;
    isLoading: boolean;
}

export interface OutputDisplayProps {
    content: string;
    onCopy?: () => void;
    targetModel?: string;
}

export interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    onDismiss?: () => void;
}

export interface LoadingSpinnerProps {
    message?: string;
}

// Error Types
export const ErrorType = {
    API_KEY_MISSING: 'API_KEY_MISSING',
    NETWORK_ERROR: 'NETWORK_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

export interface AppError {
    type: ErrorType;
    message: string;
    details?: string;
    retryable: boolean;
}

export class AppErrorClass extends Error implements AppError {
    public type: ErrorType;
    public details?: string;
    public retryable: boolean;

    constructor(type: ErrorType, message: string, details?: string, retryable: boolean = false) {
        super(message);
        this.name = 'AppError';
        this.type = type;
        this.details = details;
        this.retryable = retryable;
    }
}