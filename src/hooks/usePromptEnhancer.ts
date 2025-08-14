import { useState, useCallback, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { isRetryableError } from '../utils/errorUtils';
import { AppErrorClass } from '../types';
import type { PromptEnhancementRequest } from '../types';

interface UsePromptEnhancerState {
    prompt: string;
    enhancedPrompt: string;
    isLoading: boolean;
    error: AppErrorClass | null;
    requestHistory: PromptEnhancementRequest[];
    lastEnhancedAt: number | null;
    selectedModel: string;
}

interface UsePromptEnhancerReturn {
    state: UsePromptEnhancerState;
    actions: {
        setPrompt: (prompt: string) => void;
        setSelectedModel: (model: string) => void;
        enhancePrompt: () => Promise<void>;
        retryEnhancement: () => Promise<void>;
        clearError: () => void;
        clearAll: () => void;
        validateInput: (input: string) => string | null;
    };
    computed: {
        isEnhanceDisabled: boolean;
        canRetry: boolean;
        hasHistory: boolean;
        characterCount: number;
        isValidInput: boolean;
    };
}

export const usePromptEnhancer = (): UsePromptEnhancerReturn => {
    const [state, setState] = useState<UsePromptEnhancerState>({
        prompt: '',
        enhancedPrompt: '',
        isLoading: false,
        error: null,
        requestHistory: [],
        lastEnhancedAt: null,
        selectedModel: 'Gemini'
    });

    // Input validation
    const validateInput = useCallback((input: string): string | null => {
        if (!input.trim()) {
            return 'Prompt cannot be empty';
        }
        if (input.length > 4000) {
            return 'Prompt is too long (max 4000 characters)';
        }
        if (input.length < 10) {
            return 'Prompt is too short (min 10 characters)';
        }
        return null;
    }, []);

    // Set prompt with validation
    const setPrompt = useCallback((prompt: string) => {
        setState(prev => ({
            ...prev,
            prompt,
            error: null // Clear error when user starts typing
        }));
    }, []);

    // Set selected model
    const setSelectedModel = useCallback((model: string) => {
        setState(prev => ({
            ...prev,
            selectedModel: model
        }));
    }, []);

    // Enhance prompt
    const enhancePrompt = useCallback(async () => {
        const validationError = validateInput(state.prompt);
        if (validationError) {
            setState(prev => ({
                ...prev,
                error: new AppErrorClass('INVALID_INPUT' as any, validationError)
            }));
            return;
        }

        setState(prev => ({
            ...prev,
            isLoading: true,
            error: null
        }));

        const startTime = Date.now();

        try {
            const enhanced = await geminiService.enhancePrompt(state.prompt, state.selectedModel);
            const endTime = Date.now();

            // Add to history
            const request: PromptEnhancementRequest = {
                originalPrompt: state.prompt,
                timestamp: startTime
            };

            setState(prev => ({
                ...prev,
                enhancedPrompt: enhanced,
                isLoading: false,
                lastEnhancedAt: endTime,
                requestHistory: [request, ...prev.requestHistory.slice(0, 9)] // Keep last 10
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error as AppErrorClass,
                isLoading: false
            }));
        }
    }, [state.prompt, validateInput]);

    // Retry enhancement
    const retryEnhancement = useCallback(async () => {
        await enhancePrompt();
    }, [enhancePrompt]);

    // Clear error
    const clearError = useCallback(() => {
        setState(prev => ({
            ...prev,
            error: null
        }));
    }, []);

    // Clear all data
    const clearAll = useCallback(() => {
        setState({
            prompt: '',
            enhancedPrompt: '',
            isLoading: false,
            error: null,
            requestHistory: [],
            lastEnhancedAt: null,
            selectedModel: 'Gemini'
        });
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ctrl/Cmd + Enter to enhance
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                if (!state.isLoading && state.prompt.trim()) {
                    enhancePrompt();
                }
            }

            // Escape to clear error
            if (event.key === 'Escape' && state.error) {
                clearError();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [state.isLoading, state.prompt, state.error, enhancePrompt, clearError]);

    // Computed values
    const computed = {
        isEnhanceDisabled: !state.prompt.trim() || state.isLoading || validateInput(state.prompt) !== null,
        canRetry: state.error ? isRetryableError(state.error) : false,
        hasHistory: state.requestHistory.length > 0,
        characterCount: state.prompt.length,
        isValidInput: validateInput(state.prompt) === null
    };

    return {
        state,
        actions: {
            setPrompt,
            setSelectedModel,
            enhancePrompt,
            retryEnhancement,
            clearError,
            clearAll,
            validateInput
        },
        computed
    };
};